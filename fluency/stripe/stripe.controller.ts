import { ApiBearerAuth, ApiCreatedResponse, ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Headers, Post, Put, Query } from '@nestjs/common';

import { Access, AuthGuard, Roles } from '../common/decorators';
import { BaseController, BaseMessageDTO } from '../common/base';
import { StripeService } from './stripe.service';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import {
  AccountLinkResponseDTO,
  ConnectStatusDTO,
  CreatePaymentDTO,
  CreatePaymentResponseDTO,
  PaymentHistoryResponseDTO,
  PaymentStatusDTO,
  StripeWebhookDTO
} from './DTO';
import { BalanceResponseDTO, OptionalTimeRangeQueryDTO } from '../common/DTO';

@Controller('stripe')
@ApiTags('Stripe')
export class StripeController extends BaseController {
  constructor(private readonly stripeService: StripeService) {
    super();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Return link to connect account registration', type: AccountLinkResponseDTO, })
  @Access(AccessEnum.USER)
  @Post('connect/register')
  registerConnectAccount(@AuthUser() user: Person): Promise<AccountLinkResponseDTO> {
    return this.stripeService.registerConnectAccount(user);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns the status of account', type: ConnectStatusDTO, })
  @Access(AccessEnum.USER)
  @Get('connect/status')
  getConnectAccountStatus(@AuthUser() user: Person): Promise<ConnectStatusDTO> {
    return this.stripeService.getConnectAccountStatus(user);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns the authorization link for connect account', type: AccountLinkResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('connect/auth-link')
  getConnectAccountAuthLink(@AuthUser() user: Person): Promise<AccountLinkResponseDTO> {
    return this.stripeService.getConnectAccountAuthLink(user);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user\'s balance', type: BalanceResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('connect/balance')
  readBalance(@AuthUser() user: Person): Promise<BalanceResponseDTO> {
    return this.stripeService.getConnectAccountBalance(user);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns stripe payment history', type: [ PaymentHistoryResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('payments/history')
  stripePaymentHistory(@Query() query: OptionalTimeRangeQueryDTO): Promise<Array<PaymentHistoryResponseDTO>> {
    return this.stripeService.getStripePaymentHistory(query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Returns create payment status', type: CreatePaymentResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Post('payments/payout')
  createStripePayment(@Body() body: CreatePaymentDTO): Promise<CreatePaymentResponseDTO> {
    return this.stripeService.createStripePayment(body.paymentIdHash);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns cancel payout status', type: BaseMessageDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Put('payments/cancel/payout')
  cancelUncompletedPayout(): Promise<BaseMessageDTO> {
    return this.stripeService.cancelUncompletedPayout();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns payment status', type: [ PaymentStatusDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('payments/status')
  getPaymentStatus(): Promise<PaymentStatusDTO> {
    return this.stripeService.getPaymentStatus();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns payment status', type: [ CreatePaymentResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('payments/link')
  getPaymentLink(): Promise<CreatePaymentResponseDTO> {
    return this.stripeService.getPaymentLink();
  }

  @ApiExcludeEndpoint()
  @Post('webhook')
  stripeWebhook(@Headers('stripe-signature') header: string, @Body() body: StripeWebhookDTO): Promise<void> {
    return this.stripeService.stripeWebhook(body, header);
  }
}
