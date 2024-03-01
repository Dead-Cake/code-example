import { ApiProperty } from '@nestjs/swagger';

export class PaymentStatusDTO {
  @ApiProperty()
  status: boolean;
}
