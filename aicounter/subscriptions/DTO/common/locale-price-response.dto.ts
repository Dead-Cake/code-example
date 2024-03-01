import { ApiProperty } from '@nestjs/swagger';

/**
 *
 */
export class LocalePriceResponseDto {
  @ApiProperty()
  price: number;

  @ApiProperty()
  currency: string;
}
