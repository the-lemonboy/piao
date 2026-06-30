import { Module } from '@nestjs/common';
import { DailyQuotesController } from './daily-quotes.controller';
import { DailyQuotesService } from './daily-quotes.service';

@Module({
  controllers: [DailyQuotesController],
  providers: [DailyQuotesService]
})
export class DailyQuotesModule {}
