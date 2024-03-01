import { ApiProperty } from '@nestjs/swagger';

import { LimitsResponseDto, LocalePrice, LocaleTitleDto, PaymentEnum, TemplatesDto } from './common';

/**
 * Subscriptions Response Dto Class
 *
 * @class
 */
export class SubscriptionsResponseDto {
  @ApiProperty()
  id: string = undefined;

  @ApiProperty({ type: [ LocaleTitleDto, ], })
  title:  Array<LocaleTitleDto>;

  @ApiProperty({ type: LocalePrice, })
  price: Array<LocalePrice>;

  @ApiProperty({ type: LimitsResponseDto, })
  limits: LimitsResponseDto;

  @ApiProperty({ type: [ TemplatesDto, ], })
  templates: Array<TemplatesDto>;

  @ApiProperty({ enum: PaymentEnum, })
  paymentBackend: PaymentEnum;

  @ApiProperty()
  plan_id: string;
}
