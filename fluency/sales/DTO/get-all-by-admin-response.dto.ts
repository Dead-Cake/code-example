import { BaseResponseDTO } from '../../common/base';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllByAdminResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  hotmartTransactionCode: string;

  @ApiProperty()
  purchaseDate: Date;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  clientName: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  commission: number;

  @ApiProperty()
  warrantyDate: Date;

  @ApiProperty()
  paymentType: string;

  @ApiProperty()
  userName: string;
}
