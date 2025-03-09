import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SwaggerConfigRepository } from '../repositories/swagger-config.repository';
import { ServiceEntity } from '../entities/service.entity';
import { SwaggerExceptionHandler } from '../exceptions/swagger-exception-handler';
import { ERROR_MESSAGES } from 'src/utils';

@Injectable()
export class SwaggerService {
  private readonly logger = new Logger(SwaggerService.name);
  constructor(
    private readonly swaggerConfigRepository: SwaggerConfigRepository,
    private readonly swaggerErrorHandler: SwaggerExceptionHandler,
  ) {}
  async getSwaggerConfiguration(version: string, service: string) {
    this.logger.debug(
      `Getting the swagger config from swagger repository for version: ${version} and service: ${service}`,
    );

    this.logger.debug(`Getting the service data for serviceName: ${service}`);
    const serviceData: ServiceEntity | null =
      await this.swaggerConfigRepository.findServiceByName(service);

    if (!serviceData) {
      this.swaggerErrorHandler.handleSwaggerConfigNotFoundException();
    }

    const swaggerConfiguration =
      await this.swaggerConfigRepository.findByVersionAndService(
        version,
        serviceData?.id,
      );

    return swaggerConfiguration;
  }

  validateGetSwaggerConfigOrDocRequest(version: string, service: string) {
    if (!version) {
      this.swaggerErrorHandler.handleSwaggerConfigBadRequestException(
        ERROR_MESSAGES.SWAGGER_VERSION_EMPTY_QUERY_PARAM.message,
      );
    } else if (!service) {
      this.swaggerErrorHandler.handleSwaggerConfigBadRequestException(
        ERROR_MESSAGES.SWAGGER_SERVICE_EMPTY_QUERY_PARAM.message,
      );
    }
  }
}
