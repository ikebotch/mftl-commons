import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceDoesNotExistException extends HttpException {
  constructor() {
    super('Resource does not exist', HttpStatus.NOT_FOUND);
  }
}
