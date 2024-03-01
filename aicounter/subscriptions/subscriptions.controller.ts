import { ApiOkResponse, ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';

import { BaseController } from '../common/base.controller';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionsDto,
  GetAllSubscriptionsDto,
  GetSubscriptionsResponseDto,
  SubscriptionsResponseDto
} from './DTO';
import { BaseQueryDto } from '../common/base-query.dto';
import { BaseMessageDto } from '../common/base-message.dto';
import { AuthGuards, AuthUser } from '../auth/decorator';
import { UserPayloadInterface } from '../auth/interface';

/**
 * Subscriptions Controller Class
 *
 * @class
 */
@Controller()
@ApiTags('Subscriptions')
@AuthGuards
@ApiBearerAuth()
export class SubscriptionsController extends BaseController {
  private readonly logger = new Logger(SubscriptionsController.name);

  /**
   * Subscription Controller
   *
   * @param {SubscriptionsService} serviceSubscription Subscriptions Service
   */
  constructor (
    private readonly serviceSubscription: SubscriptionsService
  ) { super(); }

  /**
   * Create subscription method
   *
   * @param {CreateSubscriptionsDto} body - body for create subscription
   * @returns {BaseMessageDto} - return message
   */
  @ApiCreatedResponse({ description: 'Subscriptions was successfully created', type: BaseMessageDto, })
  @Post('subscriptions')
  create (@Body() body: CreateSubscriptionsDto): Promise<BaseMessageDto> {
    this.logger.debug('Create subscriptions');
    return this.serviceSubscription.create(body);
  }

  /**
   * Update subscription method
   *
   * @param {BaseQueryDto} param - params for update subscription
   * @param {CreateSubscriptionsDto} body - body for update subscription
   * @returns {SubscriptionsResponseDto} - dto for update subscription
   */
  @ApiOkResponse({ description: 'Subscriptions was successfully updated', type: SubscriptionsResponseDto, })
  @Put('subscriptions/:id')
  update (@Param() param: BaseQueryDto, @Body() body: CreateSubscriptionsDto): Promise<SubscriptionsResponseDto>  {
    this.logger.debug('Update subscriptions');
    return this.serviceSubscription.update(param.id, body);
  }

  /**
   * Read all subscription method
   *
   * @param {UserPayloadInterface} user - user from token
   * @param {GetAllSubscriptionsDto} param - params for update subscription
   * @returns {GetSubscriptionsResponseDto} - dto for return all user subscription
   */
  @ApiOkResponse({ description: 'Returns the found subscriptions', type: [ GetSubscriptionsResponseDto, ], })
  @Get('user/:userId/subscriptions')
  readAll (@AuthUser() user: UserPayloadInterface,
           @Param() param: GetAllSubscriptionsDto): Promise<Array<GetSubscriptionsResponseDto>>  {
    this.logger.debug('Get subscriptions');
    return this.serviceSubscription.readAll(user, param.userId);
  }

  /**
   * Delete subscription method
   *
   * @param {BaseQueryDto} param - params for delete subscription
   * @returns {BaseMessageDto} - return message
   */
  @ApiOkResponse({ description: 'Returns was successfully deleted', type: BaseMessageDto, })
  @Delete('subscriptions/:id')
  delete (@Param() param: BaseQueryDto): Promise<BaseMessageDto>  {
    this.logger.debug('Create subscriptions');
    return this.serviceSubscription.delete(param.id);
  }
}
