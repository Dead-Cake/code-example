import { INestApplication } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions.service';
import { Test } from '@nestjs/testing';
import * as faker from 'faker'

import { AppModule } from '../../app.module';
import { DynamoClient } from '../../common/dynamo/dynamoClient';
import { UserService } from '../../user/user.service';
import { MockUserService } from '../../user/test';
import { LocaleEnum } from '../../common/ENUM';
import { CreateSubscriptionsDto } from '../DTO';
import { MockSubscriptionRepository, MockSubscriptionService } from './index';
import { PaymentEnum } from '../DTO/common';
import { RedisService } from '../../redis/redis.service';
import { MockRedisService } from '../../redis/test';

describe('src/subscriptions/subscriptions.service.ts', () => {
  let app: INestApplication;

  let subscriptionsService: SubscriptionsService;

  const mockSubscriptionsResponse = {
    currency: MockSubscriptionRepository.subscriptions.price[0].price.currency,
    id: MockSubscriptionRepository.subscriptions.id,
    limits: MockSubscriptionRepository.subscriptions.limits,
    paymentBackend: PaymentEnum.PAYPAL,
    plan_id: MockSubscriptionRepository.subscriptions.plan_id,
    price: parseInt(MockSubscriptionRepository.subscriptions.price[0].price.price),
    templates: MockSubscriptionRepository.subscriptions.templates[0].uuid,
    title: MockSubscriptionRepository.subscriptions.title[0].title
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ AppModule, ],
    })
      .overrideProvider(DynamoClient).useValue(new MockSubscriptionRepository())
      .overrideProvider(UserService).useValue(new MockUserService())
      .overrideProvider(RedisService).useValue(new MockRedisService())
      .compile();

    subscriptionsService = moduleRef.get<SubscriptionsService>(SubscriptionsService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('src/subscriptions/subscriptions.service.ts, create', async () => {
    const test = await subscriptionsService.create(MockSubscriptionRepository.subscriptions as CreateSubscriptionsDto);
    expect(test).toEqual({ message: 'Entity successful create', },)
  });

  it('src/subscriptions/subscriptions.service.ts, update', async () => {
    const test = await subscriptionsService.update(MockSubscriptionRepository.subscriptions.id, MockSubscriptionRepository.subscriptions as CreateSubscriptionsDto);
    expect(test).toEqual(MockSubscriptionRepository.subscriptions)
  });

  it('src/subscriptions/subscriptions.service.ts, readAll', async () => {
    const test = await subscriptionsService.readAll({ email: MockUserService.user.email, name: MockUserService.user.name, locale: LocaleEnum.EN_US,
      iss: faker.datatype.string(), sub: faker.datatype.string(), }, MockUserService.user.id);
    expect(test).toEqual([ mockSubscriptionsResponse, ],)
  });

  it('src/subscriptions/subscriptions.service.ts, delete', async () => {
    const test = await subscriptionsService.delete(MockSubscriptionRepository.subscriptions.id);
    expect(test).toEqual({ message: 'Entity successful delete'},)
  });

  it('src/subscriptions/subscriptions.service.ts, readById', async () => {
    const test = await subscriptionsService.readById(MockSubscriptionRepository.subscriptions.id, LocaleEnum.EN_US);
    expect(test).toEqual(mockSubscriptionsResponse)
  });

  it('src/subscriptions/subscriptions.service.ts, readByPlanIdGsi', async () => {
    const test = await subscriptionsService.readByPlanIdGsi(MockSubscriptionRepository.subscriptions.plan_id);
    expect(test).toEqual(MockSubscriptionService.subscriptions)
  });

  it('src/subscriptions/subscriptions.service.ts, getLocalPrice', async () => {
    const test = await subscriptionsService.getLocalPrice([ {
      localeKey: LocaleEnum.EN_US,
      price: MockSubscriptionRepository.subscriptions.price[0].price,
    }
    ], LocaleEnum.EN_US);
    expect(test).toEqual({
      currency: MockSubscriptionRepository.subscriptions.price[0].price.currency,
      price: parseInt(MockSubscriptionRepository.subscriptions.price[0].price.price),
    })
  });

  it('src/subscriptions/subscriptions.service.ts, getLocalTemplates', async () => {
    const test = await subscriptionsService.getLocalTemplates([ {
      localeKey: LocaleEnum.EN_US,
      uuid: MockSubscriptionRepository.subscriptions.templates[0].uuid,
    } ], LocaleEnum.EN_US);
    expect(test).toEqual( MockSubscriptionRepository.subscriptions.templates[0].uuid)
  });

  it('src/subscriptions/subscriptions.service.ts, getLocaleTitle', async () => {
    const test = await subscriptionsService.getLocaleTitle( [ {
      localeKey: LocaleEnum.EN_US,
      title: MockSubscriptionRepository.subscriptions.title[0].title
    },
    ], LocaleEnum.EN_US);
    expect(test).toEqual(MockSubscriptionRepository.subscriptions.title[0].title)
  });
});