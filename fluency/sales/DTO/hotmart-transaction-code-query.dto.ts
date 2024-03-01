import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class HotmartTransactionCodeQueryDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  hotmartTransactionCode: string;
}
