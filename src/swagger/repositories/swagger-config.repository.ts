import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SwaggerConfig } from '../entities/swagger-config.entity';
import { ServiceEntity } from '../entities/service.entity';

@Injectable()
export class SwaggerConfigRepository extends Repository<SwaggerConfig> {
  constructor(private dataSource: DataSource) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super(SwaggerConfig, dataSource.createEntityManager());
  }

  async findOneById(swaggerConfigId: number): Promise<SwaggerConfig | null> {
    return this.findOne({
      where: { swaggerConfigId },
      relations: ['service'],
    });
  }

  async findAll(): Promise<SwaggerConfig[]> {
    return this.find({
      relations: ['service'],
    });
  }

  async findByVersionAndService(
    version: string,
    serviceId?: number,
  ): Promise<SwaggerConfig | null> {
    return this.findOne({
      where: {
        version: version,
        service: {
          id: serviceId,
        },
      },
    });
  }

  async findServiceByName(serviceName: string): Promise<ServiceEntity | null> {
    return this.dataSource
      .getRepository(ServiceEntity)
      .createQueryBuilder('service')
      .where('service.name = :serviceName', { serviceName })
      .getOne();
  }
}
