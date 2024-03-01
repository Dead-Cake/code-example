import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common';
import { TestDetailsRecord } from './test-details-record.entity';

@EntityRepository(TestDetailsRecord)
export class TestDetailsRecordRepository extends BaseRepository<TestDetailsRecord> { }
