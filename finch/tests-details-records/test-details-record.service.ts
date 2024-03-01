import { forwardRef, Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import {
  CreateTestDetailsRecordDto,
  TestDetailsRecordResponseDto,
  UpdateTestDetailsRecordDto
} from './DTO';
import { BaseMessageDto } from '../common';
import { TestDetailsRecordRepository } from './test-details-record.repository';
import { GenericContext } from '../context';
import { TestService } from '../tests/test.service';
import { TestDetailsRecord } from './test-details-record.entity';

@Injectable()
export class TestDetailsRecordService {
  constructor (private readonly testDetailsRepository: TestDetailsRecordRepository,
               @Inject(forwardRef(() => TestService))
               private readonly testService: TestService
  ) { }

  async create (context: GenericContext, testDetails: CreateTestDetailsRecordDto): Promise<TestDetailsRecordResponseDto> {
    const test = await this.testService.getTest(context, testDetails.testId);
    return this.testDetailsRepository.createEntity({ test, });
  }

  async readAll (context: GenericContext, testId: string): Promise<Array<TestDetailsRecordResponseDto>> {
    const test = await this.testService.getTest(context, testId);
    return this.testDetailsRepository.readAllEntitiesWithoutRelations({ where: { test, }, });
  }

  async update (context: GenericContext, id: string, testDetails: UpdateTestDetailsRecordDto): Promise<TestDetailsRecordResponseDto> {
    const oldTestDetails = await this.getTestDetails(context, id);
    const variantIsExist = await this.testDetailsRepository.recordIsExist({
      where: { variant: testDetails.variant, geneId: oldTestDetails.geneId, test: oldTestDetails.test, },
    });
    if (variantIsExist) {
      throw new BadRequestException('An gene with this variant is already exist');
    }
    return this.testDetailsRepository.updateEntity(id, testDetails);
  }

  async delete (context: GenericContext, id: string): Promise<BaseMessageDto> {
    await this.getTestDetails(context, id);
    await this.testDetailsRepository.deleteEntity(id);
    return { message: 'Test details was successfully deleted', };
  }


  async getTestDetails (context: GenericContext, id: string | number): Promise<TestDetailsRecord> {
    const dataFromDB = await this.testDetailsRepository.readEntityById(id);
    if (dataFromDB) {
      await this.testService.getTest(context, dataFromDB.test.id);
      return dataFromDB;
    }
    throw new NotFoundException('Test details with this id was not found');
  }
}
