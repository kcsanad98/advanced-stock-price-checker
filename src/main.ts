import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Advanced Stock Price Checker API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const host = process.env['API_HOST'];
  const port = process.env['API_PORT'];

  await app.listen(port, host);
}
bootstrap();

const defaultErrorHandler = (error: unknown) => {
  Logger.error(error, 'Process');
};

process.on('unhandledRejection', defaultErrorHandler);

process.on('uncaughtException', defaultErrorHandler);
