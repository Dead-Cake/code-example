import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Post, Headers, Logger } from '@nestjs/common';

import { PaypalService } from './paypal.service';
import { BaseController } from '../common/base.controller';
import { IPaypalSubscription, IPaypalHeaders } from './interface';

/**
 * Paypal Controller Class
 *
 * @class
 */
@Controller('callback/paypal')
@ApiTags('callback/paypal')
export class PaypalController extends BaseController {
  private readonly logger = new Logger(PaypalController.name);
  /**
   * Paypal Subscription Controller
   *
   * @param {PaypalService} paypalService Paypal Service
   */
  constructor (
    private readonly paypalService: PaypalService
  ) {
    super();
  }

  /**
   * callback
   *
   * @param {IPaypalSubscription} body - body for create subscription
   * @param {IPaypalHeaders} headers - webhook headers
   * @returns {HttpStatus} - return HttpStatus
   */
  @Post()
  create (@Body() body: IPaypalSubscription, @Headers() headers: IPaypalHeaders): Promise<HttpStatus> {
    this.logger.debug('Check subscriptions status');
    this.logger.debug(body.event_type);
    return this.paypalService.subscriptionsWebhooks(body, headers);
  }
}
