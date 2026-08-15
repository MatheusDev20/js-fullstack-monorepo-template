import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/http/http-filter-exception';

async function bootstrap() {
  const API_VERSION = 'v1';

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(`api/${API_VERSION}`, { exclude: ['health'] });

  const localOrigin = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

  process.env.NODE_ENV === 'production'
    ? app.enableCors()
    : app.enableCors(localOrigin);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  // 3001, not 3000: apps/web owns 3000 (next dev's default) and both run under
  // `turbo dev`, so sharing a default port makes one of them die on EADDRINUSE.
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
