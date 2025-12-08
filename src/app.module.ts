import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/orm.config';
import { winstonConfig } from './config/winston.config';
import { WinstonModule } from 'nest-winston';
import { UsersModule } from 'module/users/users.module';
import { AuthModule } from 'module/auth/auth.module';
import { Habit } from 'module/habits/entities/habit.entity';
import dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    WinstonModule.forRoot(winstonConfig),
    UsersModule,
    AuthModule,
    Habit,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
