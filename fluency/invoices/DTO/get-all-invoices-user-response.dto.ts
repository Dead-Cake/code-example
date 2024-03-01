import { ApiProperty } from '@nestjs/swagger';

import { InvoicesStatusEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';

export class GetAllInvoicesUserResponseDTO extends BaseResponseDTO {
  @ApiProperty({ enum: InvoicesStatusEnum, })
  status: InvoicesStatusEnum;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  actualRequestBalance: number;

  @ApiProperty()
  currentBalance: number;
}
