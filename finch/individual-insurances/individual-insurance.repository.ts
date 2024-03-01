import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common';
import { IndividualInsurance } from './individual-insurance.entity';

@EntityRepository(IndividualInsurance)
export class IndividualInsuranceRepository extends BaseRepository<IndividualInsurance> { }
