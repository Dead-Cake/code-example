import { ApiProperty } from '@nestjs/swagger';

export class GroupStatisticsResponseDTO {
  @ApiProperty()
  totalSales: number;

  @ApiProperty()
  currentYearSales: number;

  @ApiProperty()
  currentYear: number;
}
