import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsSafeInteger } from '../../common/validators';

export class CreateTestDetailsRecordDto {
  @IsSafeInteger()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  testId: number;
}
