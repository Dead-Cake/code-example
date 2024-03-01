import { ApiProperty } from '@nestjs/swagger';

import { InvoicesStatusEnum } from '../../common/enums';

export class GetAllInvoicesAdminResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: InvoicesStatusEnum, })
  status: InvoicesStatusEnum;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  actualRequestBalance: number;

  @ApiProperty()
  currentBalance: number;

  @ApiProperty()
  pixId: number;

  @ApiProperty()
  bankAccountId: number;
}
