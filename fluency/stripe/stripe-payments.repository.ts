import { EntityRepository } from 'typeorm';

import { StripePayments } from './stripe-payments.entity';
import { BaseRepository } from '../common/base';

@EntityRepository(StripePayments)
export class StripePaymentsRepository extends BaseRepository<StripePayments> {
}
