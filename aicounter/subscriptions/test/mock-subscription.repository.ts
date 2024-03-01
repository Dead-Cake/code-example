import * as faker from 'faker'

import { MockBaseRepository } from '../../common/test';
import { PaymentEnum } from '../DTO/common';
import { MockSubscriptionService } from './mock-subscription.service';

export class MockSubscriptionRepository extends MockBaseRepository {
  static subscriptions = {
    id: faker.datatype.uuid(),
    limits: {
      'hour': faker.datatype.number(),
      'minute': faker.datatype.number(),
      'day': faker.datatype.number(),
      'month': faker.datatype.number(),
      'bonus': faker.datatype.number(),
    },

    price: [{
      localeKey: 'en-US',
      price: {
        price: faker.datatype.number().toString(),
        currency: faker.datatype.string(),
      }
    }],
    currency: faker.datatype.string(),
    templates: [{
      localeKey: 'en-US',
      uuid: [ faker.datatype.string(), ]
    }],
    title: [{
      localeKey: 'en-US',
      title: faker.datatype.string(),
    }],
    paymentBackend: PaymentEnum.PAYPAL,
    plan_id: faker.datatype.string(),
  };

  async readAllEntities (TableName: string): Promise<Array<any>> {
    return [ MockSubscriptionRepository.subscriptions ]
  }

  async updateEntity (TableName: string, key: object, attributeUpdates: object): Promise<any> {
    return MockSubscriptionRepository.subscriptions;
  }

  async readEntity (TableName: string, key: object): Promise<any> {
    return MockSubscriptionRepository.subscriptions
  }

  async readEntityByGsi (TableName: string, gsiName: string, secondaryKey: string, secondaryValue: string): Promise<any> {
    return [ MockSubscriptionService.subscriptions ];
  }
}
