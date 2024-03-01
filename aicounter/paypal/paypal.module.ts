import { forwardRef, Module } from '@nestjs/common';

import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { UserSubscriptionModule } from '../user-subscription/user-subscription.module';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';

/**
 *
 */
@Module({
  controllers: [ PaypalController, ],
  imports: [
    forwardRef(() => UserSubscriptionModule),
    forwardRef(() => RedisModule),
    UserModule,
  ],
  providers: [ PaypalService, ],
  exports: [ PaypalService, ],
})
export class PaypalModule { }
