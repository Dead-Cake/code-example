import { IsArray, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsSafeInteger } from '../../common/validators';

export class MultipleOperationsOnSpreadsheetTemplatesDto {
  @IsArray()
  @IsSafeInteger({ each: true, })
  @IsInt({ each: true, })
  @IsPositive({ each: true, })
  @IsNotEmpty()
  @ApiProperty({ required: false, type: [ Number, ], })
  ids: Array<number>;
}
