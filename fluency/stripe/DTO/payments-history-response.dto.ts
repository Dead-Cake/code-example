import { ApiProperty } from '@nestjs/swagger';
import { TransactionsStatusEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';

export class PaymentHistoryResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  chargeId: string;

  @ApiProperty({ enum: TransactionsStatusEnum, })
  status: TransactionsStatusEnum;

  @ApiProperty()
  deliveredAt: Date;
}
