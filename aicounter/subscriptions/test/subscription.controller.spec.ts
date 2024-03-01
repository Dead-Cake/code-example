import { CanActivate, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import assert = require('assert');

import { AppModule } from '../../app.module';
import { MockSubscriptionRepository } from './index';
import { AuthGuard } from '../../auth/auth.guard';
import { MockLoggerService } from '../../common/test';
import { DynamoClient } from '../../common/dynamo/dynamoClient';
import { UserService } from '../../user/user.service';
import { MockUserService } from '../../user/test';
import { RedisService } from '../../redis/redis.service';
import { MockRedisService } from '../../redis/test';

describe('src/subscriptions/subscriptions.controller.ts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true), };

    const moduleRef = await Test.createTestingModule({
      imports: [ AppModule, ],
    })
      .overrideProvider(DynamoClient).useValue(new MockSubscriptionRepository())
      .overrideProvider(UserService).useValue(new MockUserService())
      .overrideGuard(AuthGuard).useValue(mockAuthGuard)
      .overrideProvider(RedisService).useValue(new MockRedisService())
      .setLogger(new MockLoggerService())
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('src/subscriptions/subscriptions.controller.ts, /GET', () => {
    return request(app.getHttpServer())
      .get('/user/108382244763756268636@google/subscriptions')
      .expect(200)
      .then(res => {
        assert(MockSubscriptionRepository.subscriptions);
      });
  });

  it('src/subscriptions/subscriptions.controller.ts, /POST', () => {
    return request(app.getHttpServer())
      .post('/subscriptions')
      .send({ additionalInformation: 'test', subscriptionId: 1, })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(res => {
        assert(MockSubscriptionRepository.subscriptions);
      });
  });

  it('src/subscriptions/subscriptions.controller.ts, /PUT', () => {
    return request(app.getHttpServer())
      .put('/subscriptions/1')
      .send({ additionalInformation: 'test', subscriptionId: 1, })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        assert(MockSubscriptionRepository.subscriptions);
      });
  });

  it('src/subscriptions/subscriptions.controller.ts, /DELETE', () => {
    return request(app.getHttpServer())
      .delete('/subscriptions/1')
      .expect(200)
      .then(res => {
        assert(MockSubscriptionRepository.subscriptions);
      });
  });
});
