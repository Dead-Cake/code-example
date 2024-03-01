import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base';
import { TransactionsStatusEnum } from '../common/enums';
import { Transactions } from '../transactions/transactions.entity';

@Entity('stripe_payments')
export class StripePayments extends BaseEntity {
  @Column({ name: 'payment_id', })
  paymentId: string;

  @Column({ name: 'charge_id', })
  chargeId: string;

  @Column()
  status: TransactionsStatusEnum;

  @Column({ name: 'delivered_at', })
  deliveredAt: Date;

  @OneToMany( () => Transactions, transactions => transactions.stripePayment)
  transactions: Array<Transactions>;
}
