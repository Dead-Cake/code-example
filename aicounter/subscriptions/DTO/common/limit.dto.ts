import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 *
 */
export class LimitDto {
  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  used: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, })
  allocated: number;
}
