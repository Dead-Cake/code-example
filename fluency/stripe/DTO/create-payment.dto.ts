import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  paymentIdHash: string;
}
