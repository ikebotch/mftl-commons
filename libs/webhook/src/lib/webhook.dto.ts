import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({ type: String, default: '' })
  @IsNotEmpty()
  event!: string;

  @ApiProperty({ type: String, default: '' })
  @IsNotEmpty()
  registeredUrl!: string;

  @ApiProperty({ type: String, default: '' })
  @IsNotEmpty()
  clientId!: string;
}

export class UpdateWebhookDto {
  @ApiProperty({ type: String, default: '' })
  @IsNotEmpty()
  event!: string;

  @ApiProperty({ type: String, default: '' })
  @IsNotEmpty()
  registeredUrl!: string;

  @ApiProperty({ type: String, default: '' })
  @IsNotEmpty()
  clientId!: string;
}
