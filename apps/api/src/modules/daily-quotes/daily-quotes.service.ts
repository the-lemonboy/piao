import { Injectable, Logger, OnModuleDestroy, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

interface DeepSeekMessage {
  role: 'system' | 'user';
  content: string;
}

interface DeepSeekResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface QuotePayload {
  content: string;
  author: string;
}

@Injectable()
export class DailyQuotesService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DailyQuotesService.name);
  private timer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  onModuleInit() {
    this.scheduleNextMidnightRun();
  }

  onModuleDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  async findLatest() {
    return this.prisma.dailyQuote.findFirst({
      orderBy: {
        quoteDate: 'desc'
      }
    });
  }

  async generateAndSaveToday() {
    const quoteDate = this.getLocalDayStart(new Date());
    const quote = await this.requestDailyQuote();

    return this.prisma.dailyQuote.upsert({
      where: {
        quoteDate
      },
      update: quote,
      create: {
        quoteDate,
        ...quote
      }
    });
  }

  private scheduleNextMidnightRun() {
    const delay = this.getDelayToNextLocalMidnight();

    this.timer = setTimeout(() => {
      void this.runScheduledJob();
    }, delay);
  }

  private async runScheduledJob() {
    try {
      await this.generateAndSaveToday();
      this.logger.log('Daily quote generated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Daily quote generation failed: ${message}`);
    } finally {
      this.scheduleNextMidnightRun();
    }
  }

  private getDelayToNextLocalMidnight() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return nextMidnight.getTime() - now.getTime();
  }

  private getLocalDayStart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private async requestDailyQuote(): Promise<QuotePayload> {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');

    if (!apiKey) {
      throw new ServiceUnavailableException('DEEPSEEK_API_KEY is not configured');
    }

    const apiUrl = this.configService.get<string>('DEEPSEEK_API_URL') ?? 'https://api.deepseek.com/chat/completions';
    const model = this.configService.get<string>('DEEPSEEK_MODEL') ?? 'deepseek-chat';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: this.buildPrompt(),
        response_format: {
          type: 'json_object'
        },
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ServiceUnavailableException(`DeepSeek API failed: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as DeepSeekResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new ServiceUnavailableException('DeepSeek API returned an empty response');
    }

    return this.parseQuote(content);
  }

  private buildPrompt(): DeepSeekMessage[] {
    return [
      {
        role: 'system',
        content:
          '你是票根收藏应用的书签文案生成器。必须只返回一个合法 JSON 对象，不要 Markdown，不要解释。JSON 必须包含 content 和 author 两个字符串字段。'
      },
      {
        role: 'user',
        content:
          '请从王小波已经出版的书或杂文中选择一句适合票根收藏、电影、演出、旅行回忆场景展示的书签短句。必须是真实原句，不要改写，不要伪造出处；content 不超过 24 个汉字，author 写成“王小波《作品名》”。如果不能确认原句和出处，返回一句短的公版文学摘句，author 写清作者和作品。只返回 JSON：{"content":"xxx","author":"王小波《作品名》"}'
      }
    ];
  }

  private parseQuote(rawContent: string): QuotePayload {
    const parsed = JSON.parse(rawContent) as Partial<QuotePayload>;
    const content = this.normalizeText(parsed.content);
    const author = this.normalizeText(parsed.author);

    if (!content || !author) {
      throw new ServiceUnavailableException('DeepSeek API returned invalid quote JSON');
    }

    return {
      content,
      author
    };
  }

  private normalizeText(value: unknown) {
    return typeof value === 'string' ? value.trim() : '';
  }
}
