import { Controller, Get, Logger, Query } from '@nestjs/common';
import { API_ROUTES, API_VERSION_1 } from 'src/utils';
import { SwaggerService } from '../providers/swagger.service';

@Controller(API_VERSION_1)
export class SwaggerController {
  private readonly logger = new Logger(SwaggerController.name);
  constructor(private readonly swaggerService: SwaggerService) {}

  @Get(API_ROUTES.swaggerConfig)
  async getSwaggerConfiguration(
    @Query('version') version: string,
    @Query('service') service: string,
  ) {
    this.logger.log(`Validating the request params`);
    this.swaggerService.validateGetSwaggerConfigOrDocRequest(version, service);
    this.logger.log(
      `Getting the swagger configuration for version: ${version} and service: ${service}`,
      'SwaggerController',
    );
    return await this.swaggerService.getSwaggerConfiguration(version, service);
  }
}
