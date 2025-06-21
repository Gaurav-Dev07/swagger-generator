import { Module } from '@nestjs/common';
import { HealthService } from './controller/health.controller';

@Module({
  controllers: [HealthService],
})
export class HealthModule {}
