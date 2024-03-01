import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentResponseDTO {
  @ApiProperty()
  paymentLink: string;
}
