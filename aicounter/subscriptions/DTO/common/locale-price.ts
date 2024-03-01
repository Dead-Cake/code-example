import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { LocalePriceObject } from './locale-price-object';
import { LocaleEnum } from '../../../common/ENUM';

/**
 *
 */
export class LocalePrice {
  @IsEnum(LocaleEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: LocaleEnum, })
  localeKey: LocaleEnum;

  @ValidateNested()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ type: LocalePriceObject, })
  @Type(() => LocalePriceObject)
  price: LocalePriceObject;

}
