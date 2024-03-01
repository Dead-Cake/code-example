import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PolicyHolder } from '../../common/SQL-enums';

export class UpdateIndividualInsuranceDto {
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
  holderLastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  holderMiddleName: string;

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
  hmoAuth: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  preAuthNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  phoneNumber: string;
}
