import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsNotEmpty, IsString } from 'class-validator';

import { LocaleEnum } from '../../../common/ENUM';

/**
 *
 */
export class TemplatesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: LocaleEnum, })
  localeKey: LocaleEnum;

  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [ String, ], })
  uuid: Array<string>;
}
