import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Get All Subscriptions Dto Class
 *
 * @class
 */
export class GetAllSubscriptionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
