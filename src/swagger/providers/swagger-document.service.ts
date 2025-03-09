import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as swaggerUi from 'swagger-ui-express';
import { SwaggerConfigRepository } from '../repositories/swagger-config.repository';
import { SwaggerExceptionHandler } from '../exceptions/swagger-exception-handler';
import { API_ROUTES, SWAGGER_BASE_ROUTE, swaggerInitScript } from 'src/utils';

@Injectable()
export class SwagggerDocumentService {
  private readonly logger = new Logger(SwagggerDocumentService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly swaggerConfigRepository: SwaggerConfigRepository,
    private readonly errorHandler: SwaggerExceptionHandler,
  ) {}

  async generateSwaggerDocument(version: string, serviceName: string) {
    const serviceData =
      await this.swaggerConfigRepository.findServiceByName(serviceName);
    if (!serviceData) {
      this.errorHandler.handleSwaggerConfigNotFoundException();
    }
    return this.getSwaggerHtmlDocument(version, serviceName);
  }

  private getSwaggerHtmlDocument(version: string, serviceName: string) {
    this.logger.log('Generating swagger html');
    const configApiBaseUrl = this.configService.get<string>('APP_BASE_URL');
    const swaggerConfigAPIEndpoint = `${configApiBaseUrl}/api/v1${SWAGGER_BASE_ROUTE}/${API_ROUTES.swaggerConfig}?version=${version}&service=${serviceName}`;
    this.logger.debug(
      `Generated swaggerConfig Url: ${swaggerConfigAPIEndpoint}`,
    );

    let swaggerHtml = swaggerUi.generateHTML();
    swaggerHtml = this.injectDependenciesInSwaggerHtml(
      swaggerHtml,
      swaggerConfigAPIEndpoint,
    );
    return swaggerHtml;
  }

  private injectDependenciesInSwaggerHtml(
    swaggerHtml: string,
    swaggerConfigAPIEndpoint: string,
  ) {
    console.log('swaggerConfigAPIEndpoint', swaggerConfigAPIEndpoint);
    return swaggerHtml
      .replace(
        `<link rel="stylesheet" type="text/css" href="./swagger-ui.css" >`,
        `<link rel="stylesheet" type="text/css" href="/swagger-static/swagger-ui.css" >`,
      )
      .replace(
        `<script src="./swagger-ui-bundle.js"> </script>`,
        `<script src="/swagger-static/swagger-ui-bundle.js"> </script>`,
      )
      .replace(
        `<script src="./swagger-ui-standalone-preset.js"> </script>`,
        `<script src="/swagger-static/swagger-ui-standalone-preset.js"> </script>`,
      )
      .replace(
        `<script src="./swagger-ui-init.js"> </script>`,
        swaggerInitScript(swaggerConfigAPIEndpoint),
      );
  }
}
