import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../utils/constants/application-messages';

class SwaggerConfigNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

class GetSwaggerBadRequest extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
export class SwaggerExceptionHandler {
  constructor() {}
  handleSwaggerConfigNotFoundException() {
    throw new SwaggerConfigNotFoundException(
      ERROR_MESSAGES.SWAGGER_CONFIG_NOT_FOUND.message,
    );
  }

  handleSwaggerConfigBadRequestException(message: string) {
    throw new GetSwaggerBadRequest(message);
  }
}
