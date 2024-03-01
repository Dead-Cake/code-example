import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsGlossaryId } from '../../common/validators';

export class UpdateTestDetailsRecordDto {
  @IsGlossaryId({ context: 'gene', })
  @IsNotEmpty()
  @ApiProperty()
  geneId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, })
  variant: string;

  @IsGlossaryId({ context: 'gene-classification', })
  @IsNotEmpty()
  @ApiProperty()
  classificationId: number;
}
