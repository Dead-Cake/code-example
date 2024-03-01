import { ApiProperty } from '@nestjs/swagger';

export class SaleHistoryItemDTO {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  numberOfSales: number;
}

export class SaleHistoryResponseDTO {
  @ApiProperty({ isArray: true, type: SaleHistoryItemDTO, })
  history: Array<SaleHistoryItemDTO>;

  @ApiProperty()
  total: number;
}
