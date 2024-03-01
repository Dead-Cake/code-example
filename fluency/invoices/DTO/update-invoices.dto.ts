import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsNullable } from '../../common/validators';
import { InvoicesStatusEnum } from '../../common/enums';

export class UpdateInvoicesDTO {
  @IsEnum(InvoicesStatusEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: InvoicesStatusEnum, })
  status: InvoicesStatusEnum;

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true, })
  comment: string;
}
