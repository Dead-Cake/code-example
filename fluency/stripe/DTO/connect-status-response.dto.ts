import { ApiProperty } from '@nestjs/swagger';

import { ConnectStatusEnum } from '../enums';

export class ConnectStatusDTO {
  @ApiProperty()
  status: ConnectStatusEnum;
}
