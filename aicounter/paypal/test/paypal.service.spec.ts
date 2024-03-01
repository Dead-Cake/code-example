import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as faker from 'faker'

import { AppModule } from '../../app.module';
import { DynamoClient } from '../../common/dynamo/dynamoClient';
import { PaypalService } from '../paypal.service';
import { MockPaypalRepository } from './mock-paypal.repository';
import { UserSubscriptionService } from '../../user-subscription/user-subscription.service';
import { MockUserSubscriptionsService } from '../../user-subscription/test';
import { RedisService } from '../../redis/redis.service';
import { MockRedisService } from '../../redis/test';

describe('src/paypal/paypal.service.ts', () => {
  let app: INestApplication;

  let paypalService: PaypalService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ AppModule, ],
    })
      .overrideProvider(DynamoClient).useValue(new MockPaypalRepository())
      .overrideProvider(UserSubscriptionService).useValue(new MockUserSubscriptionsService())
      .overrideProvider(RedisService).useValue(new MockRedisService())
      .compile();

    paypalService = moduleRef.get<PaypalService>(PaypalService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('src/paypal/paypal.service.ts, delete', async () => {
    const test = await paypalService.delete(faker.datatype.string());
    expect(test).toEqual( { message: 'UserSubscriptions was successfully deleted', },)
  });

  it('src/paypal/paypal.service.ts, updateLimits', async () => {
    const test = await paypalService.updateLimits(faker.datatype.string());
    expect(test).toEqual(undefined)
  });
});