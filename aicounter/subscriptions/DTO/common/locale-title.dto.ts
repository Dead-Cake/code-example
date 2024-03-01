import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { LocaleEnum } from '../../../common/ENUM';

/**
 *
 */
export class LocaleTitleDto {
  @IsEnum(LocaleEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: LocaleEnum, })
  localeKey: LocaleEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
