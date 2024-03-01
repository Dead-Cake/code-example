import { ApiProperty } from '@nestjs/swagger';

import { LimitsDto, PaymentEnum } from './common';

/**
 * Get Subscriptions Response Dto Class
 *
 * @class
 */
export class GetSubscriptionsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ type: LimitsDto, })
  limits: LimitsDto;

  @ApiProperty({ required: false, })
  templates?: Array<string>;

  @ApiProperty({ enum: PaymentEnum, })
  paymentBackend: PaymentEnum;

  @ApiProperty()
  plan_id: string;
}
