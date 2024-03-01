import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from '../../common';

export class SpreadsheetTemplateResponseDto extends BaseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  settings: object;

  @ApiProperty()
  isShared: boolean;

  @ApiProperty({ required: false, })
  createdBy?: string;

  @ApiProperty({ required: false, })
  itsMy?: boolean;

  @ApiProperty()
  categoryId?: number;
}
