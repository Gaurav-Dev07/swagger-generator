/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { API_ROUTES } from './utils';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    // Swagger Configuration
    const config = new DocumentBuilder()
      .setTitle('Your API Title')
      .setDescription('API Description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useStaticAssets(join(__dirname, '../node_modules/swagger-ui-dist'), {
      prefix: API_ROUTES.swaggerStaticEndpoint,
    });

    await app.listen(configService.get<number>('APP_PORT') || 2000);
  } catch (error) {
    console.error('Application startup error:', error);
  }
}
bootstrap();
