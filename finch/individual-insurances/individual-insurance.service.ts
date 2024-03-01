import { BadRequestException, Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';

import { IndividualInsuranceRepository } from './individual-insurance.repository';
import { CreateIndividualInsuranceDto, IndividualInsuranceResponseDto, UpdateIndividualInsuranceDto } from './DTO';
import { IndividualService } from '../individuals/individual.service';

@Injectable()
export class IndividualInsuranceService {
  constructor (
    private readonly individualInsuranceRepository: IndividualInsuranceRepository,
    @Inject(forwardRef(() => IndividualService))
    private readonly individualService: IndividualService
  ) { }

  async create (individualInsurance: CreateIndividualInsuranceDto): Promise<IndividualInsuranceResponseDto> {
    const individual = await this.individualService.getIndividual(individualInsurance.individualId);
    const individualInsuranceIsExist = await this.individualInsuranceRepository.recordIsExist({
      where: { individual, },
    });

    if (individualInsuranceIsExist) {
      throw new BadRequestException('IndividualInsuranceRecord for this individual already exists');
    }
    return this.individualInsuranceRepository.createEntity({ ...individualInsurance, individual, });
  }

  async read (id: string): Promise<IndividualInsuranceResponseDto> {
    const dataFromDB = await this.individualInsuranceRepository.readEntityByIdWithoutRelations(id);

    if (dataFromDB) {
      return dataFromDB;
    }
    throw new NotFoundException('IndividualInsurance with this id was not found');

  }

  async update (id: string, individualInsurance: UpdateIndividualInsuranceDto): Promise<IndividualInsuranceResponseDto> {
    const dataFromDB = await this.individualInsuranceRepository.readEntityByIdWithoutRelations(id, {
      select: [ 'id', ],
    });

    if (dataFromDB) {
      return this.individualInsuranceRepository.updateEntity(id, individualInsurance);
    }
    throw new NotFoundException('IndividualInsurance with this id was not found');

  }

}
