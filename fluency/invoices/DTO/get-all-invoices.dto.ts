import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderByEnum, Sorting } from '../../common/enums';
import { Transform } from 'class-transformer';
import { parseBoolean } from '../../common/utilities/parsing.helper';

export class GetAllInvoicesDTO {
  @IsNotEmpty()
  @IsEnum(OrderByEnum)
  @ApiProperty({ enum: OrderByEnum, })
  orderBy: OrderByEnum;

  @IsNotEmpty()
  @IsEnum(Sorting)
  @IsNotEmpty()
  @ApiProperty({ enum: Sorting, })
  sorting: Sorting;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, })
  search: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  analysisStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  acceptedStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  rejectedStatus: boolean;
}
