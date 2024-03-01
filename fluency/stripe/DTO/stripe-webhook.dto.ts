import { IPaymentProcessing, ITransfer } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

class StripeWebhookObjectDTO {
  @ApiProperty()
  object: IPaymentProcessing | ITransfer | { id: string };
}

export class StripeWebhookDTO {
  @ApiProperty()
  type: string;

  @ApiProperty({ type: StripeWebhookObjectDTO, })
  data: StripeWebhookObjectDTO;
}
