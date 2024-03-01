import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { parseDateTime } from '../../common/utilities';
import { SortingSalesOptionsDTO } from './sorting-sales-options.dto';

export class GetAllAdminQueryDTO extends SortingSalesOptionsDTO {
  @Transform(date => parseDateTime(date), { toClassOnly: true, })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  startDate: Date;

  @Transform(date => parseDateTime(date), { toClassOnly: true, })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  endDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, })
  search: string;
}
