import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@codegenie/serverless-express';
import type { Context, Handler } from 'aws-lambda';
import express, { json } from 'express';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/http/http-filter-exception';

const API_VERSION = 'v1';

/**
 * Cached across warm invocations — bootstrapping Nest costs hundreds of ms, so
 * it must happen once per container, not once per request.
 */
let cachedHandler: Handler;

async function bootstrapServer(): Promise<Handler> {
  const expressApp = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { cors: true },
  );

  nestApp.use(json({ limit: '10kb' }));
  nestApp.setGlobalPrefix(`api/${API_VERSION}`);
  nestApp.useGlobalPipes(new ValidationPipe());
  nestApp.useGlobalFilters(new HttpExceptionFilter());

  await nestApp.init();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: unknown, context: Context) => {
  cachedHandler ??= await bootstrapServer();
  return cachedHandler(event, context, () => {});
};
