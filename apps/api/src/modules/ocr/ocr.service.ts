import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OcrTicketTemplateType, RecognizedTicketResult } from '@piaogen/shared';
import { createHash, createHmac } from 'crypto';

interface TencentOcrResponse {
  Response?: {
    TextDetections?: Array<{
      DetectedText?: string;
      Confidence?: number;
    }>;
    Error?: {
      Code?: string;
      Message?: string;
    };
    RequestId?: string;
  };
}

@Injectable()
export class OcrService {
  constructor(private readonly configService: ConfigService) {}

  async recognizeTicket(imageBase64: string): Promise<RecognizedTicketResult> {
    const lines = await this.callTencentGeneralBasicOcr(this.normalizeBase64(imageBase64));
    const rawText = lines.map((line) => line.text).join('\n');

    return {
      templateType: this.inferTemplateType(rawText),
      title: this.inferTitle(lines.map((line) => line.text)),
      rawText,
      lines
    };
  }

  private normalizeBase64(value: string): string {
    return value.replace(/^data:image\/\w+;base64,/, '').trim();
  }

  private async callTencentGeneralBasicOcr(imageBase64: string): Promise<RecognizedTicketResult['lines']> {
    const secretId = this.configService.get<string>('OCR_PROVIDER_ID');
    const secretKey = this.configService.get<string>('OCR_PROVIDER_KEY');
    const region = this.configService.get<string>('OCR_PROVIDER_REGION') ?? 'ap-guangzhou';

    if (!secretId || !secretKey) {
      throw new ServiceUnavailableException('Tencent Cloud OCR credentials are not configured');
    }

    const host = 'ocr.tencentcloudapi.com';
    const service = 'ocr';
    const action = 'GeneralBasicOCR';
    const version = '2018-11-19';
    const timestamp = Math.floor(Date.now() / 1000);
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
    const payload = JSON.stringify({
      ImageBase64: imageBase64
    });
    const authorization = this.createTencentAuthorization({
      action,
      date,
      host,
      payload,
      secretId,
      secretKey,
      service,
      timestamp
    });

    const response = await fetch(`https://${host}`, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json; charset=utf-8',
        Host: host,
        'X-TC-Action': action,
        'X-TC-Region': region,
        'X-TC-Timestamp': `${timestamp}`,
        'X-TC-Version': version
      },
      body: payload
    });
    const data = (await response.json()) as TencentOcrResponse;

    if (!response.ok || data.Response?.Error) {
      throw new ServiceUnavailableException(data.Response?.Error?.Message || 'Tencent Cloud OCR request failed');
    }

    return (data.Response?.TextDetections ?? [])
      .map((item) => ({
        text: item.DetectedText?.trim() ?? '',
        confidence: item.Confidence
      }))
      .filter((item) => item.text);
  }

  private createTencentAuthorization(input: {
    action: string;
    date: string;
    host: string;
    payload: string;
    secretId: string;
    secretKey: string;
    service: string;
    timestamp: number;
  }): string {
    const httpRequestMethod = 'POST';
    const canonicalUri = '/';
    const canonicalQueryString = '';
    const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${input.host}\n`;
    const signedHeaders = 'content-type;host';
    const hashedRequestPayload = this.sha256(input.payload);
    const canonicalRequest = [
      httpRequestMethod,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      hashedRequestPayload
    ].join('\n');
    const algorithm = 'TC3-HMAC-SHA256';
    const credentialScope = `${input.date}/${input.service}/tc3_request`;
    const stringToSign = [
      algorithm,
      `${input.timestamp}`,
      credentialScope,
      this.sha256(canonicalRequest)
    ].join('\n');
    const secretDate = this.hmacBuffer(`TC3${input.secretKey}`, input.date);
    const secretService = this.hmacBuffer(secretDate, input.service);
    const secretSigning = this.hmacBuffer(secretService, 'tc3_request');
    const signature = this.hmacHex(secretSigning, stringToSign);

    return `${algorithm} Credential=${input.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  }

  private sha256(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private hmacBuffer(key: string | Buffer, value: string): Buffer {
    return createHmac('sha256', key).update(value).digest();
  }

  private hmacHex(key: string | Buffer, value: string): string {
    return createHmac('sha256', key).update(value).digest('hex');
  }

  private inferTemplateType(rawText: string): OcrTicketTemplateType {
    const text = rawText.toLowerCase();

    if (/车次|候车|二等座|一等座|12306|高铁|动车/.test(rawText)) {
      return 'train';
    }

    if (/boarding|gate|seat|passenger|flight|机场|登机|航班/.test(text)) {
      return 'flight';
    }

    if (/电影|影院|影厅|hall|seat|price|放映/.test(rawText) || /cinema|movie/.test(text)) {
      return 'movie';
    }

    if (/景区|门票|入园|scenic|admit|ticket type/.test(text)) {
      return 'scenic';
    }

    return 'unknown';
  }

  private inferTitle(lines: string[]): string | undefined {
    return lines.find((line) => line.length >= 2 && line.length <= 32);
  }
}
