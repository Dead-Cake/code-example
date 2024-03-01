import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

import { PolicyHolder } from '../../common/SQL-enums';
import { IsSafeInteger } from '../../common/validators';

export class CreateIndividualInsuranceDto {
  @IsSafeInteger()
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  individualId: number;

  @IsEnum(PolicyHolder)
  @IsOptional()
  @ApiProperty({ enum: PolicyHolder, required: false, })
  policyHolder: PolicyHolder;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  holderFirstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  holderMiddleName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  holderLastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  company: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  policy: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  preAuthNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  hmoAuth: string;
}
