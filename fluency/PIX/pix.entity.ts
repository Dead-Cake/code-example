import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { PixKeyEnum } from '../common/enums';
import { BankAccount } from '../bank-accounts/bank-account.entity';

@Entity('pix')
export class Pix extends BaseEntity {
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cnpj: string;

  @Column()
  key: PixKeyEnum;

  @Column()
  cpf: string;

  @OneToOne(() => User, user => user.pix)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @OneToOne(() => BankAccount, bankAccount => bankAccount.pix)
  @JoinColumn({ name: 'bank_account_id', })
  bankAccount: BankAccount;
}
