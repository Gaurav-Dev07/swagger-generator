import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthService {
  @Get('')
  getHealthStatus() {
    console.log('getting the health status');
    return {
      status: 200,
      message: 'success',
    };
  }
}
