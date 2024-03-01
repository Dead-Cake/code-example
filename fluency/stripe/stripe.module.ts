import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../users/user.module';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripePayments } from './stripe-payments.entity';
import { StripePaymentsRepository } from './stripe-payments.repository';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  controllers: [ StripeController, ],
  providers: [ StripeService, ],
  imports: [
    TypeOrmModule.forFeature([ StripePayments, StripePaymentsRepository, ]),
    forwardRef(() => UserModule),
    forwardRef(() => TransactionsModule),
  ],
  exports: [ StripeService, ],
})

export class StripeModule {}
