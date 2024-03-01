import { forwardRef, Module } from '@nestjs/common';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';

/**
 *
 */
@Module({
  controllers: [ SubscriptionsController, ],
  imports: [
    forwardRef(() => UserModule),
    RedisModule,
  ],
  providers: [ SubscriptionsService, ],
  exports: [ SubscriptionsService, ],
})
export class SubscriptionsModule { }
