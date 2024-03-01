import * as faker from 'faker'

import { LocaleEnum } from '../../common/ENUM';
import { GetSubscriptionsResponseDto } from '../DTO';
import { PaymentEnum } from '../DTO/common';

export class MockSubscriptionService {
  static subscriptions = {
    id: faker.datatype.uuid(),
    limits: {
      'hour': faker.datatype.number(),
      'minute': faker.datatype.number(),
      'day': faker.datatype.number(),
      'month': faker.datatype.number(),
      'bonus': faker.datatype.number(),
    },

    price: faker.datatype.number(),
    currency: faker.datatype.string(),
    templates: [ faker.datatype.string(), ],
    title: faker.datatype.string(),
    paymentBackend: PaymentEnum.PAYPAL,
    plan_id: faker.datatype.string(),
  };

  async readById (id: string, locale: LocaleEnum): Promise<GetSubscriptionsResponseDto> {
    return MockSubscriptionService.subscriptions;
  }

  async readByPlanIdGsi (planId: string): Promise<GetSubscriptionsResponseDto> {
    return MockSubscriptionService.subscriptions;
  }
}
