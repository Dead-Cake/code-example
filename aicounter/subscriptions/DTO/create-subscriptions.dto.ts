import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray, IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional, IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { LimitsDto, LocaleTitleDto, LocalePrice, TemplatesDto, PaymentEnum } from './common';
import { ArrayContainsValue } from '../../common/validator';
import { ConfigService } from '../../common/config/config.service';

/**
 * Create Subscriptions Dto Class
 *
 * @class
 */
export class CreateSubscriptionsDto {
  @ValidateNested({ each: true, })
  @ArrayUnique(o => o.localeKey)
  @ArrayContainsValue({ context: 'localeKey', })
  @ArrayMinSize(ConfigService.getInstance().localeEnumLength)
  @IsArray()
  @ApiProperty({ type: [ LocaleTitleDto, ], })
  @Type(() => LocaleTitleDto)
  title: Array<LocaleTitleDto>;

  @ValidateNested({ each: true, })
  @ArrayMinSize(ConfigService.getInstance().localeEnumLength)
  @ArrayUnique(o => o.localeKey)
  @ArrayContainsValue({ context: 'localeKey', })
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [ LocalePrice, ], })
  @Type(() => LocalePrice)
  price: Array<LocalePrice>;

  @ValidateNested({ each: true, })
  @IsObject()
  @IsNotEmpty()
  @Type(() => LimitsDto)
  @ApiProperty({ type: LimitsDto, })
  limits: LimitsDto;

  @ValidateNested({ each: true, })
  @ArrayMinSize(ConfigService.getInstance().localeEnumLength)
  @ArrayUnique(o => o.localeKey)
  @ArrayContainsValue({ context: 'localeKey', })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [ TemplatesDto, ], required: false, })
  @Type(() => TemplatesDto)
  templates: Array<TemplatesDto>;

  @IsEnum(PaymentEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: PaymentEnum, })
  paymentBackend: PaymentEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  plan_id: string;
}
