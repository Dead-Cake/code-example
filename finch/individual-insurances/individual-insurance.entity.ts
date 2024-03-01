import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../common';
import { PolicyHolder } from '../common/SQL-enums';
import { Individual } from '../individuals/individual.entity';

@Entity( { name: 'individual_insurance', })
export class IndividualInsurance extends BaseEntity {
  @Column({ type: 'enum', name: 'policy_holder', enum: PolicyHolder, })
  policyHolder: PolicyHolder;

  @Column({ name: 'holder_first_name', })
  holderFirstName: string;

  @Column({ name: 'holder_last_name', })
  holderLastName: string;

  @Column({ name: 'holder_middle_name', })
  holderMiddleName: string;

  @Column()
  company: string;

  @Column()
  policy: string;

  @Column({ name: 'phone_number', })
  phoneNumber: string;

  @Column({ name: 'pre_auth_number', })
  preAuthNumber: string;

  @Column({ name: 'hmo_auth', })
  hmoAuth: string;

  @OneToOne(type => Individual, individual => individual.insurance)
  @JoinColumn({ name: 'individual_id', })
  individual: Individual;
}
