import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { LimitDto } from '.';

/**
 *
 */
export class LimitsResponseDto {
  @IsOptional()
  @Type(() => LimitDto)
  @ApiProperty({ required: false, })
  minute: LimitDto;

  @IsOptional()
  @Type(() => LimitDto)
  @ApiProperty({ required: false, })
  hour: LimitDto;

  @IsOptional()
  @Type(() => LimitDto)
  @ApiProperty({ required: false, })
  day: LimitDto;

  @IsOptional()
  @Type(() => LimitDto)
  @ApiProperty({ required: false, })
  month: LimitDto;

  @IsOptional()
  @Type(() => LimitDto)
  @ApiProperty({ required: false, })
  bonus: LimitDto;
}
