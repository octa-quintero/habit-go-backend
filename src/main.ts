import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    logger.log(`Servidor funcionando en el puerto: ${port}`, {
      context: 'Bootstrap',
    });
  });
}

void bootstrap();
