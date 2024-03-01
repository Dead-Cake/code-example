import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsSafeInteger, IsPositiveIntegerNumberString } from '../../common/validators';
import { Sorting, SharedFilter } from '../../common/enums/filters';
import { OrderByEnum } from './order-by.enum';

export class GetAllSpreadsheetTemplatesDto {
  @IsEnum(SharedFilter)
  @IsNotEmpty()
  @ApiProperty({ enum: SharedFilter, })
  filter: SharedFilter;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  search: string;

  @IsPositiveIntegerNumberString()
  @IsSafeInteger()
  @IsOptional()
  @ApiProperty({ required: false, })
  categoryId: string;

  @IsEnum(OrderByEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: OrderByEnum, })
  orderBy: OrderByEnum;

  @IsEnum(Sorting)
  @IsNotEmpty()
  @ApiProperty({ enum: Sorting, })
  sorting: Sorting;
}
