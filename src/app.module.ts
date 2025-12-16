import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/orm.config';
import { winstonConfig } from './config/winston.config';
import { throttlerConfig } from './config/throttler.config';
import { WinstonModule } from 'nest-winston';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'module/users/users.module';
import { AuthModule } from 'module/auth/auth.module';
import { HabitsModule } from 'module/habits/habits.module';
import { HabitRegisterModule } from 'module/habit-register/habit-register.module';
import { RewardModule } from 'module/reward/reward.module';
import { EmailModule } from 'module/email/email.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    UsersModule,
    AuthModule,
    HabitsModule,
    HabitRegisterModule,
    RewardModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
