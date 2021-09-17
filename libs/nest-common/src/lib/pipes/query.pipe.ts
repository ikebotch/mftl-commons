import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class QueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // remove limit and page from values
    const { limit, page, ...query } = value;
    return query;
  }
}
