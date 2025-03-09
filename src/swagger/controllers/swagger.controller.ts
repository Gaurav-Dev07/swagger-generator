import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { SwaggerService } from '../providers/swagger.service';
import { API_ROUTES, API_VERSION_1, SWAGGER_BASE_ROUTE } from 'src/utils/constants';
import { SwagggerDocumentService } from '../providers/swagger-document.service';
import { Response } from 'express';

@Controller(`${API_VERSION_1}${SWAGGER_BASE_ROUTE}`)
export class SwaggerController {
  private readonly logger = new Logger(SwaggerController.name);
  constructor(
    private readonly swaggerService: SwaggerService,
    private readonly swaggerDocumentService: SwagggerDocumentService,
  ) {}

  @Get(`${API_ROUTES.swaggerConfig}`)
  async getSwaggerConfiguration(
    @Query('version') version: string,
    @Query('service') service: string,
  ) {
    this.logger.log(`Validating the ${API_ROUTES.swaggerConfig} request`);
    this.swaggerService.validateGetSwaggerConfigOrDocRequest(version, service);
    this.logger.log(
      `Getting the swagger configuration for version: ${version} and service: ${service}`,
      'SwaggerController',
    );
    return await this.swaggerService.getSwaggerConfiguration(version, service);
  }

  @Get(API_ROUTES.swaggerDocument)
  async getSwaggerDocumentWithVersion(
    @Query('version') version: string,
    @Query('service') service: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Validating the ${API_ROUTES.swaggerDocument} request`);
    this.swaggerService.validateGetSwaggerConfigOrDocRequest(version, service);
    const swaggerHtml =
      await this.swaggerDocumentService.generateSwaggerDocument(
        version,
        service,
      );
    res.setHeader('Content-Type', 'text/html');
    res.send(swaggerHtml);
  }
}
