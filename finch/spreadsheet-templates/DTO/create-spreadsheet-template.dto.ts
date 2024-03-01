import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsObject, IsString, IsPositive, IsInt } from 'class-validator';
import { IsSafeInteger } from '../../common/validators';

export class CreateSpreadsheetTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
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
