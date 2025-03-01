import { Module } from '@nestjs/common';
import { SwaggerController } from './controllers/swagger.controller';
import { SwaggerService } from './providers/swagger.service';
import { SwaggerConfigRepository } from './repositories/swagger-config.repository';
import { SwaggerExceptionHandler } from './exceptions/swagger-exception-handler';

@Module({
  controllers: [SwaggerController],
  providers: [SwaggerService, SwaggerConfigRepository, SwaggerExceptionHandler],
})
export class SwaggerModule {}
