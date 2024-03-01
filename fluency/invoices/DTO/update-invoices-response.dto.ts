import { ApiProperty } from '@nestjs/swagger';

import { InvoicesStatusEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';

export class UpdateInvoicesResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  status: InvoicesStatusEnum;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  balance: number;
}
