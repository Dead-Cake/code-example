import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString } from 'class-validator';
import { IsSafeInteger } from '../../common/validators';

export class UpdateSpreadsheetTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  description: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  settings: object;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isShared: boolean;

  @IsSafeInteger()
  @IsPositive()
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  categoryId: number;

}
