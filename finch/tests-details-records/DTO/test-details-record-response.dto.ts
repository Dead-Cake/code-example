import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from '../../common';

export class TestDetailsRecordResponseDto extends BaseDto {
  @ApiProperty()
  geneId: number;

  @ApiProperty()
  variant: string;

  @ApiProperty()
  classificationId: number;
}
