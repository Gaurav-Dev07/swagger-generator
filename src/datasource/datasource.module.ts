import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/swagger/entities/service.entity';
import { SwaggerConfig } from 'src/swagger/entities/swagger-config.entity';
import * as dotenv from 'dotenv';
dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: [SwaggerConfig, ServiceEntity],
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC === 'true' ? true : false,
      logging: process.env.DB_LOGGING === 'true' ? true : false,
      poolSize: 10, // Adjust pool size as needed
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      ssl: {
        rejectUnauthorized: false, // Set to true in production if you have a valid certificate
      },
    }),
  ],
})
export class DataSourceModule {
  constructor() {
    console.log('initializing module', process.env.DB_USERNAME);
  }
}
