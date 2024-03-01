import { ApiProperty } from '@nestjs/swagger';
import { BalanceResponseDTO } from '../../common/DTO';

export class StripeBalanceResponseDTO {
  @ApiProperty({ type: BalanceResponseDTO, })
  available: BalanceResponseDTO;

  @ApiProperty({ type: BalanceResponseDTO, })
  pending: BalanceResponseDTO;
}
