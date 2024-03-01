import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 *
 */
export class LimitsDto {
  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  hour: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  minute: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  day: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  month: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  bonus: number;
}
