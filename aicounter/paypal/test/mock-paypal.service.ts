import { HttpStatus } from '@nestjs/common';
import { BaseMessageDto } from '../../common/base-message.dto';

export class MockPaypalService {
  async getSubscriptionDetails (subscriptionId: string): Promise<HttpStatus> {
    return HttpStatus.OK;
  };

  async delete (subscriptionId: string): Promise<BaseMessageDto> {
    return { message: 'UserSubscriptions was successfully deleted', };
  }

  async cancelSubscription (subscriptionId: string): Promise<void> { }
}
