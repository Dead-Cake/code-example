import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { DynamoClient } from '../common/dynamo/dynamoClient';
import { CreateSubscriptionsDto, GetSubscriptionsResponseDto, SubscriptionsResponseDto } from './DTO';
import { LocalePrice, LocalePriceResponseDto, LocaleTitleDto, TemplatesDto } from './DTO/common';
import { LocaleEnum } from '../common/ENUM';
import { BaseMessageDto } from '../common/base-message.dto';
import { ConfigService } from '../common/config/config.service';
import { UserService } from '../user/user.service';
import { UserPayloadInterface } from '../auth/interface';

/**
 * Subscription Controller Class
 *
 * @class
 */
@Injectable()
export class SubscriptionsService {
  private readonly tableName;
  private readonly logger = new Logger(SubscriptionsService.name);

  /**
   * User Subscription Service.
   *
   * @param {ConfigService} configService config service
   * @param {DynamoClient} dynamoClient dynamo service
   * @param {UserService} userService user service
   */
  constructor (
    private readonly configService: ConfigService,
    private readonly dynamoClient: DynamoClient,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    this.tableName = this.configService.subscriptionsTable;
  }


  /**
   * create subscription
   *
   * @param {CreateSubscriptionsDto} body - dto for create subscription
   * @returns {Promise<BaseMessageDto>} - return message
   */
  async create (body: CreateSubscriptionsDto): Promise<BaseMessageDto> {
    await this.dynamoClient.createEntity(this.tableName, body);
    return { message: 'Entity successful create', };
  }

  /**
   * update subscription
   *
   * @param {string} id - uuid subscription id
   * @param {CreateSubscriptionsDto} body - dto for update subscription
   * @returns {Promise<SubscriptionsResponseDto>} - dto for return update subscription
   */
  async update (id: string, body: CreateSubscriptionsDto): Promise<SubscriptionsResponseDto> {
    return this.dynamoClient.updateEntity(this.tableName, { id, }, body);
  }

  /**
   * read all subscriptions by userId
   *
   * @param {UserPayloadInterface} user - user from token
   * @param {string} userId - uuid user id
   * @returns {Promise<Array<SubscriptionsResponseDto>>} - dto for read all subscription
   */
  async readAll (user: UserPayloadInterface, userId: string): Promise<Array<GetSubscriptionsResponseDto>> {
    const userFromDB = await this.userService.read(userId);
    userFromDB.locale = await this.userService.getLocale(userFromDB, user);
    const dataFromDB = await this.dynamoClient.readAllEntities(this.tableName);
    return dataFromDB.map(val => {
      const price = this.getLocalPrice(val.price, userFromDB.locale);
      return {
        id: val.id,
        limits: val.limits,
        price: price.price,
        currency: price.currency,
        templates: this.getLocalTemplates(val.templates, userFromDB.locale),
        title: this.getLocaleTitle(val.title, userFromDB.locale),
        paymentBackend: val.paymentBackend,
        plan_id: val.plan_id,
      };
    });
  }

  /**
   * delete all subscriptions
   *
   * @param {string} id - uuid subscription id
   * @returns {Promise<BaseMessageDto>} - return message
   */
  async delete (id: string): Promise<BaseMessageDto> {
    return this.dynamoClient.deleteEntity(this.tableName, { id, });
  }

  /**
   * read subscription by id and locale
   *
   * @param {string} id - uuid subscription id
   * @param {LocaleEnum} locale - locale for filter subscriptions
   * @returns {Promise<GetSubscriptionsResponseDto>} - dto for read by uuid subscription id
   */
  async readById (id: string, locale: LocaleEnum): Promise<GetSubscriptionsResponseDto> {
    const val = await this.dynamoClient.readEntity(this.tableName, { id, });
    if (!val) {
      return null;
    }
    const price = this.getLocalPrice(val.price, locale);
    return {
      id: val.id,
      title: this.getLocaleTitle(val.title, locale),
      price: price.price,
      currency: price.currency,
      limits: val.limits,
      templates: this.getLocalTemplates(val.templates, locale),
      paymentBackend: val.paymentBackend,
      plan_id: val.plan_id,
    };
  }

  /**
   * read subscription by plan id
   *
   * @param {string} planId - paypal plan id
   * @throws {NotFoundException} User subscription not found
   * @returns {Promise<GetSubscriptionsResponseDto>} - dto for return read subscription
   */
  async readByPlanIdGsi (planId: string): Promise<GetSubscriptionsResponseDto> {
    const dataFromDB = await this.dynamoClient.readEntityByGsi(this.tableName,
      'plan_id_gsi', 'plan_id', planId);

    if (dataFromDB.length > 1) {
      this.logger.log(JSON.stringify({ dataFromDB, type: 'too-many-entries-returned', }));
      throw new NotFoundException('too many subscription found');
    }
    return dataFromDB ? dataFromDB[0] : null;
  }

  /**
   * get price by locale
   *
   * @param {Array<LocalePrice>} prices - prices array
   * @param {LocaleEnum} locale - locale for search subscriptions
   * @returns {LocalePriceResponseDto} - dto for get locale price
   */
  getLocalPrice (prices: Array<LocalePrice>, locale: LocaleEnum): LocalePriceResponseDto {
    const result = prices.find(o => o.localeKey === locale);
    if (result) {
      return { price: parseInt(result.price.price), currency: result.price.currency, };
    }

    const country = locale.split('-')[1];
    const countryPrices = prices.find(o => o.localeKey.includes(country));
    if (countryPrices) {
      return { price: parseInt(countryPrices.price.price), currency: countryPrices.price.currency, };
    }

    const defaultPrices = prices.find(o => o.localeKey.includes('US'));
    if (defaultPrices) {
      return { price: parseInt(defaultPrices.price.price), currency: defaultPrices.price.currency, };
    }
  }
  /**
   * get template by locale
   *
   * @param {Array<TemplatesDto>} template - template array
   * @param {LocaleEnum} locale - locale for search subscriptions
   * @returns {Array<string>} - template array
   */
  getLocalTemplates (template: Array<TemplatesDto>, locale: LocaleEnum): Array<string> {
    const result = template.find(o => o.localeKey === locale);
    if (result) {
      return result.uuid;
    }
    const country = locale.split('-')[1];
    const countryTemplate = template.find(o => o.localeKey.includes(country));
    if (countryTemplate) {
      return countryTemplate.uuid;
    }
    const defaultTemplate = template.find(o => o.localeKey.includes('US'));
    if (defaultTemplate) {
      return defaultTemplate.uuid;
    }
  }

  /**
   * get title by locale
   *
   * @param {Array<LocaleTitleDto>} title - title  array
   * @param {LocaleEnum} locale - locale for search subscriptions
   * @returns {string} - locale title
   */
  getLocaleTitle (title: Array<LocaleTitleDto>, locale: LocaleEnum): string {
    const result = title.find(o => o.localeKey === locale);
    if (result) {
      return result.title;
    }
    const language = locale.split('-')[0];
    const languageTemplate = title.find(o => o.localeKey.includes(language));
    if (languageTemplate) {
      return languageTemplate.title;
    }

    const defaultTitle = title.find(o => o.localeKey.includes('en'));
    if (defaultTitle) {
      return defaultTitle.title;
    }
  }
}
