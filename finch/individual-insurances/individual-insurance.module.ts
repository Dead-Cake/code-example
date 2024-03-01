import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IndividualInsurance } from './individual-insurance.entity';
import { IndividualInsuranceController } from './individual-insurance.controller';
import { IndividualInsuranceRepository } from './individual-insurance.repository';
import { IndividualInsuranceService } from './individual-insurance.service';
import { LoggerService } from '../config/logger.service';
import { IndividualModule } from '../individuals/individual.module';

@Module({
  controllers: [ IndividualInsuranceController, ],
  imports: [
    forwardRef(() =>IndividualModule),
    TypeOrmModule.forFeature([ IndividualInsurance, IndividualInsuranceRepository, ]),
  ],
  providers: [ LoggerService, IndividualInsuranceService, ],
})
export class IndividualInsuranceModule { }
