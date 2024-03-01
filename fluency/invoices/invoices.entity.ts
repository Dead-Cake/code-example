import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { InvoicesStatusEnum } from '../common/enums';
import { User } from '../users/user.entity';
import { File } from '../files/file.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column()
  status: InvoicesStatusEnum;

  @Column()
  comment: string;

  @Column()
  balance: number;

  @ManyToOne(() => User, user => user.invoice)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @OneToOne(() => File, file => file.invoice)
  @JoinColumn({ name: 'file_id', })
  file: File;
}
