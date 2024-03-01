import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { IsGlossaryId, IsNullable, IsSubGlossaryId } from '../../common/validators';
import { PixKeyEnum } from '../../common/enums';

export class CreatePixDTO {
  @IsNullable()
  @IsEmail()
  @ApiProperty({ nullable: true, })
  email: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  cnpj: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  phone: string;

  @IsNotEmpty()
  @IsEnum(PixKeyEnum)
  @ApiProperty({ enum: PixKeyEnum, })
  key: PixKeyEnum;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  cpf: string;

  @IsNullable()
  @IsGlossaryId({ context: 'bank', })
  @ApiProperty({ nullable: true, })
  bankId: number;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  agency: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  accountNumber: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  city: string;

  @IsNullable()
  @IsSubGlossaryId('countryId', { context: 'state', })
  @ApiProperty({ nullable: true, })
  stateId: number;
}
