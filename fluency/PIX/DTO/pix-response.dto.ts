import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { PixKeyEnum } from '../../common/enums';

export class PixResponseDTO extends BaseResponseDTO {
  @ApiProperty({ nullable: true, })
  cpf: string;

  @ApiProperty({ nullable: true, })
  bankId: number;

  @ApiProperty({ nullable: true, })
  agency: string;

  @ApiProperty({ nullable: true, })
  accountNumber: string;

  @ApiProperty({ nullable: true, })
  email: string;

  @ApiProperty({ nullable: true, })
  phone: string;

  @ApiProperty({ nullable: true, })
  cnpj: string;

  @ApiProperty({ enum: PixKeyEnum, nullable: true, })
  key: PixKeyEnum;

  @ApiProperty({ nullable: true, })
  city: string;

  @ApiProperty({ nullable: true, })
  stateId: number;

  @ApiProperty({ nullable: true, })
  countryId: number;
}
