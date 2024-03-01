import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from '../../common';
import { PolicyHolder } from '../../common/SQL-enums';

export class IndividualInsuranceResponseDto extends BaseDto {
  @ApiProperty({ enum: PolicyHolder, })
  policyHolder: PolicyHolder;

  @ApiProperty()
  holderFirstName: string;

  @ApiProperty()
  holderLastName: string;

  @ApiProperty()
  holderMiddleName: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  policy: string;

  @ApiProperty()
  hmoAuth: string;

  @ApiProperty()
  preAuthNumber: string;

  @ApiProperty()
  phoneNumber: string;
}
