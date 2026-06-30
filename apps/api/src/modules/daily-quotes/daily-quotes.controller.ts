import { Controller, Get, Post } from '@nestjs/common';
import { DailyQuotesService } from './daily-quotes.service';

@Controller('daily-quotes')
export class DailyQuotesController {
  constructor(private readonly dailyQuotesService: DailyQuotesService) {}

  @Get('latest')
  async latest() {
    return {
      data: await this.dailyQuotesService.findLatest()
    };
  }

  @Post('generate')
  async generateToday() {
    return {
      data: await this.dailyQuotesService.generateAndSaveToday()
    };
  }
}
