import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

/**
 *
 */
export class LocalePriceObject {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currency: string;
}
