import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './utils/all-exception-filter';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionFilter());
  const port = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;
  await app.listen(port);
}

bootstrap();
