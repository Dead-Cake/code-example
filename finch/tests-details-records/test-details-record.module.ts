import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestDetailsRecordController } from './test-details-record.controller';
import { TestDetailsRecordService } from './test-details-record.service';
import { TestDetailsRecord } from './test-details-record.entity';
import { TestDetailsRecordRepository } from './test-details-record.repository';
import { TestModule } from '../tests/test.module';

@Module({
  controllers: [ TestDetailsRecordController, ],
  imports: [
    TypeOrmModule.forFeature([ TestDetailsRecord, TestDetailsRecordRepository, ]),
    forwardRef(() => TestModule),
  ],
  providers: [ TestDetailsRecordService, ],
  exports: [ TestDetailsRecordService, ],
})
export class TestDetailsRecordModule {}
