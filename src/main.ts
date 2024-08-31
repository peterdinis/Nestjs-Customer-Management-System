import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

dotenv.config({
  path: '.env',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Customer Management API')
    .setDescription('API for managing customers')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT');

  if (!port) {
    console.error('Error: PORT is not defined in the .env file.');
    process.exit(1);
  }

  await app.listen(port);
}
bootstrap();
