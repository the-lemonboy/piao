import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DailyQuotesModule } from './modules/daily-quotes/daily-quotes.module';
import { HealthModule } from './modules/health/health.module';
import { TicketsModule } from './modules/tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    DailyQuotesModule,
    HealthModule,
    TicketsModule
  ]
})
export class AppModule {}
