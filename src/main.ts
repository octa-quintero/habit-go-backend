import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Ajusta los orígenes según tus necesidades
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log(`🚀 Servidor funcionando en el puerto: ${port}`);
  });
}

void bootstrap();
