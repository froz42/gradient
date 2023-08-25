import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './utils/all-exception-filter';
import { Logger } from '@nestjs/common';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionFilter());
  const port = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;
  Logger.log(`Listening on port ${port}`, 'Bootstrap');
  await app.listen(port);
}

bootstrap();
