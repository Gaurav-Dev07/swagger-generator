import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/swagger/entities/service.entity';
import { SwaggerConfig } from 'src/swagger/entities/swagger-config.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: [SwaggerConfig, ServiceEntity],
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC === 'true' ? true : false,
      logging: process.env.DB_LOGGING === 'true' ? true : false,
    }),
  ],
})
export class DataSourceModule {
  constructor() {
    console.log('initializing module', process.env.DB_USERNAME);
  }
}
