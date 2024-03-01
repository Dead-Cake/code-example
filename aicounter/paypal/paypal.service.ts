import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';

import { ConfigService } from '../common/config/config.service';
import { BaseMessageDto } from '../common/base-message.dto';
import { DynamoClient } from '../common/dynamo/dynamoClient';
import { IPaypalHeaders, IPaypalSubscription } from './interface';
import { PaypalWebhookEventTypeEnum } from '../common/ENUM';
import { UserSubscriptionService } from '../user-subscription/user-subscription.service';
import { RedisService } from '../redis/redis.service';
import { Request } from '../common/libs/request';
import { UserService } from '../user/user.service';

/**
 * Paypal Service Class
 *
 * @class
 */
@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);
  /**
   * Paypal Service.
   *
   * @param {ConfigService} configService config
   * @param {DynamoClient} dynamoClient dynamo service
   * @param {UserSubscriptionService} userSubscriptionService user subscriptions service
   * @param {UserService} userService user service
   * @param {RedisService} redisService redis Service
   */
  constructor (
    private readonly configService: ConfigService,
    private readonly dynamoClient: DynamoClient,
    @Inject(forwardRef(() => UserSubscriptionService))
    private readonly userSubscriptionService: UserSubscriptionService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => RedisService))
    private readonly redisService: RedisService
  ) {
    this.headers = {
      'Authorization': ` Basic ${Buffer
        .from(`${this.configService.paypalClientId}:${this.configService.paypalClientSecret}`)
        .toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  private readonly headers: Record<string, string>;
  /**
   * delete subscription if subscription was cancel
   * add user subscriptions if payment completed
   *
   * @param {IPaypalSubscription} body - subscriptionId
   * @param {IPaypalHeaders} headers - webhook headers
   * @returns {Promise<HttpStatus>} - return HttpStatus
   */
  async subscriptionsWebhooks (body: IPaypalSubscription, headers: IPaypalHeaders): Promise<HttpStatus> {
    switch (body.event_type) {
      case PaypalWebhookEventTypeEnum.CANCEL:
      case PaypalWebhookEventTypeEnum.EXPIRED:
        await this.verifyWebhook(body, headers);
        await this.delete(body.resource.id);
        return HttpStatus.OK;

      case PaypalWebhookEventTypeEnum.PAYMENT_COMPLETED:
        await this.verifyWebhook(body, headers);
        const subscription = await this.getSubscriptionDetails(body.resource.billing_agreement_id);
        const userId = body.resource.custom_id?.split(':')?.[0] ?? body.resource.custom?.split(':')?.[0];
        await this.userSubscriptionService.create(userId, body.resource.billing_agreement_id,
          {
            planId: subscription.plan_id,
            additionalInformation: JSON.stringify(body),
            lastPaymentDate: DateTime.utc().toISO(),
          });
        await this.updateLimits(body.resource.billing_agreement_id);
        return HttpStatus.OK;
    }
  }
  /**
   * Verify webhook signature
   *
   * @param {IPaypalSubscription} body - body
   * @param {IPaypalHeaders} headers - headers
   * @throws {BadRequestException} - This subscription is not Active/This subscription not found or not valid
   * @returns {Promise<void>}
   */
  async verifyWebhook (body: IPaypalSubscription, headers: IPaypalHeaders): Promise<void> {
    const signature = { auth_algo: headers['paypal-auth-algo'], cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'], transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_event: body, webhook_id: this.configService.paypalWebhookId, };
    const url = `${this.configService.paypalBaseUrl}/v1/notifications/verify-webhook-signature`;

    this.logger.debug({ verifyWebhookRequest: url, signature, });
    const subscription = await new Request(`${url}`, this.headers)
      .post<{ status: HttpStatus, }>({ body: signature, });
    this.logger.debug({ verifyWebhookResponse: subscription, });

    if (subscription.status !== HttpStatus.OK) {
      this.logger.warn(`Subscription status was not OK: ${subscription.status}`);
      throw new BadRequestException('This subscription is not verify.');
    }
  }

  /**
   * get subscription details from paypal
   *
   * @param {string} subscriptionId - uuid subscription id
   * @throws {BadRequestException} - This subscription is not Active/This subscription not found or not valid
   * @returns {Promise<any>} - return subscription
   */
  async getSubscriptionDetails (subscriptionId: string): Promise<any> {
    const url = `${this.configService.paypalBaseUrl}/v1/billing/subscriptions/${subscriptionId}`;
    this.logger.debug({ getSubscriptionDetails: subscriptionId, url, });
    const subscription = await new Request(url, this.headers)
      .get<{ status: string, }>();
    this.logger.debug({ getSubscriptionDetailsResponse: subscription, });

    if (!subscription?.status) {
      throw new BadRequestException('This subscription not found or not valid');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new BadRequestException('This subscription is not Active.');
    }
    return subscription;
  }

  /**
   * cancel Subscription
   *
   * @param {string} subscriptionId - uuid subscription id
   */
  async cancelSubscription (subscriptionId: string): Promise<void> {
    const url = `${this.configService.paypalBaseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`;
    this.logger.debug({ cancelSubscriptionRequest: url, });
    const subscription = await new Request(url, this.headers)
      .post<{ status: HttpStatus, }>({ body: { 'reason': 'Another subscription selected', }, });
    this.logger.debug({ cancelSubscriptionResponse: subscription, });

    if (subscription.status !== HttpStatus.NO_CONTENT) {
      this.logger.error(`Subscription was not cancelled, status ${subscription.status}`);
      // TODO: throw new BadRequestException('This subscription was not calcelled.');
    }
  }


  /**
   * delete user subscription by paypalSubscriptionId
   *
   * @param {string} paypalSubscriptionId - paypal subscription id
   * @returns {Promise<BaseMessageDto>} - return message
   */
  async delete (paypalSubscriptionId: string): Promise<BaseMessageDto> {
    const dataFromDB = await this.userSubscriptionService.readUserSubscriptionByPaypalSubGsi(paypalSubscriptionId);
    if (dataFromDB) {
      await this.dynamoClient.deleteEntity(this.configService.userSubscriptionTable, { id: dataFromDB.id, });
    }
    return { message: 'UserSubscriptions was successfully deleted', };
  }

  /**
   * update subscription if subscription was cancelled
   *
   * @param {string} subscriptionId - ${user.sub}@${user.iss}
   * @returns {void}
   */
  async updateLimits (subscriptionId: string): Promise<void> {
    const userSubscription = await this.userSubscriptionService.readUserSubscriptionByPaypalSubGsi(subscriptionId);
    const { id, ...updateUserSubscription } = userSubscription;
    updateUserSubscription.lastPaymentDate = DateTime.utc().toISO();
    await this.userSubscriptionService.update(id, updateUserSubscription);
    await this.userService.updateLimitsCounter(userSubscription.user_id);
  }
}
