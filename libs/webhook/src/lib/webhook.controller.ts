import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateWebhookDto, UpdateWebhookDto } from './webhook.dto';
import { WebhookService } from './webhook.service';

@Controller('webhook')
@ApiTags('Webhook')
export class WebhookController {
  constructor(private service: WebhookService) {}

  @Get('events')
  events() {
    // return all events
    return this.service.getEvents();
  }

  @Get('requests')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  fetchRequests(
    @Query() query: any,
    @Query('page') page = 1,
    @Query('limit') limit = Number(process.env.MFTL_CONSTANT_PAGINATION_LIMIT)
  ) {
    return this.service.fetchRequests({ page, limit }, query);
  }

  @Post('subscriptions')
  create(@Body() body: CreateWebhookDto) {
    return this.service.create(body);
  }

  @Put('subscriptions/:id')
  update(@Param('id') id: string, @Body() body: UpdateWebhookDto) {
    return this.service.update(id, body);
  }

  @Get('subscriptions/:id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('subscriptions')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  find(
    @Query() query: any,
    @Query('page') page = 1,
    @Query('limit') limit = Number(process.env.MFTL_CONSTANT_PAGINATION_LIMIT)
  ) {
    return this.service.find({ page, limit }, query);
  }

  @Delete('subscriptions')
  delete(id: string) {
    return this.service.delete(id);
  }
}
