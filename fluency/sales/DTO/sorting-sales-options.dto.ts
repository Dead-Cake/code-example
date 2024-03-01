import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { Sorting } from '../../common/enums';
import { SalesOrderByEnum } from '../common/enums';

export class SortingSalesOptionsDTO {
  @IsNotEmpty()
  @IsEnum(SalesOrderByEnum)
  @ApiProperty({ enum: SalesOrderByEnum, })
  orderBy: SalesOrderByEnum;

  @IsNotEmpty()
  @IsEnum(Sorting)
  @ApiProperty({ enum: Sorting, })
  sorting: Sorting;
}
