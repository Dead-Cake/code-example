import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { Transactions } from '../transactions/transactions.entity';

@Entity('sales')
export class Sale extends BaseEntity {
  @Column({ name: 'hotmart_transaction_code', })
  hotmartTransactionCode: string;

  @Column({ name: 'client_name', })
  clientName: string;

  @Column({ name: 'client_email', })
  clientEmail: string;

  @Column({ name: 'client_phone_number', })
  clientPhoneNumber: string;

  @Column({ name: 'client_country', })
  clientCountry: string;

  @Column({ name: 'client_state', })
  clientState: string;

  @Column({ name: 'client_city', })
  clientCity: string;

  @Column({ name: 'client_district', })
  clientDistrict: string;

  @Column({ name: 'product_name', })
  productName: string;

  @Column({ name: 'product_id', })
  productId: string;

  @Column()
  status: string;

  @Column()
  price: number;

  @Column({ name: 'recurrency_period', })
  recurrencyPeriod: number;

  @Column({ name: 'payment_type', })
  paymentType: string;

  @Column({ name: 'warranty_date', })
  warrantyDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @OneToMany( () => Transactions, transactions => transactions.sale)
  transactions: Array<Transactions>;
}
