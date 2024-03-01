import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Between, In, Not } from 'typeorm';
import { DateTime } from 'luxon';

import {
  AccountLinkResponseDTO,
  ConnectStatusDTO,
  CreatePaymentResponseDTO,
  PaymentStatusDTO,
  StripeWebhookDTO
} from './DTO';
import { Person } from '../auth/models';
import { UserService } from '../users/user.service';
import { AppConfigService, LoggerService, StripeApiService } from '../common/services';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/interfaces';
import { TransactionsService } from '../transactions/transactions.service';
import { StripePaymentsRepository } from './stripe-payments.repository';
import { TransactionsStatusEnum } from '../common/enums';
import { BalanceResponseDTO, OptionalTimeRangeQueryDTO } from '../common/DTO';
import { StripePayments } from './stripe-payments.entity';
import { IPaymentProcessing, ITransfer } from './interfaces';
import { ConnectStatusEnum } from './enums';
import { BaseMessageDTO } from '../common/base';

@Injectable()
export class StripeService {
  constructor(
    private readonly stripePaymentsRepository: StripePaymentsRepository,
    private readonly stripeApiService: StripeApiService,
    private readonly logger: LoggerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => TransactionsService))
    private transactionsService: TransactionsService,
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly config: AppConfigService
  ) { }

  async registerConnectAccount(person: Person): Promise<AccountLinkResponseDTO> {
    const userId = person.userId;
    const user = await this.userService.getUserWithStripeAccountId(userId);
    if (user.stripeAccountId) {
      throw new BadRequestException('User already has stripe account');
    }
    const account = await this.stripeApiService.registration(user);
    await this.userService.setStripeAccountId(userId, account.id);
    const accountLink = await this.stripeApiService.createOnBoardingLink(account.id);

    return { accountLink: accountLink.url, };
  }

  async getConnectAccountAuthLink(person: Person): Promise<AccountLinkResponseDTO> {
    const user = await this.userService.readById(person.userId, null, [ 'stripeAccountId', ]);
    let loginLink;
    const { status, } = await this.getConnectAccountStatus(person);
    if (status === ConnectStatusEnum.PENDING) {
      loginLink = await this.stripeApiService.createOnBoardingLink(user.stripeAccountId);
    } else if (status === ConnectStatusEnum.REGISTERED) {
      loginLink = await this.stripeApiService.createLoginLink(user.stripeAccountId);
    } else {
      throw new ForbiddenException('User doesn\'t have stripe account');
    }
    return { accountLink: loginLink.url, };
  }

  async getConnectAccountStatus(person: Person): Promise<ConnectStatusDTO> {
    let status;
    const { stripeAccountId, } = await this.userService.readById(person.userId, null, [ 'stripeAccountId', ]);
    if (!stripeAccountId) {
      status = ConnectStatusEnum.UNREGISTERED;
    } else if (stripeAccountId) {
      const stripeUser = await this.stripeApiService.getConnectedAccount(stripeAccountId);
      if (stripeUser.details_submitted === true) {
        status = ConnectStatusEnum.REGISTERED;
      } else {
        status = ConnectStatusEnum.PENDING;
      }
    }
    return { status, };
  }

  async getConnectAccountBalance(person: Person): Promise<BalanceResponseDTO> {
    const user = await this.userService.readById(person.userId, null, [ 'stripeAccountId', ]);
    await this.checkStripeAccountId(user.stripeAccountId);
    return this.stripeApiService.getBalance(user.stripeAccountId);
  }

  getStripePaymentHistory(query: OptionalTimeRangeQueryDTO): Promise<Array<StripePayments>> {
    let options;
    if (query) {
      options = {
        where: {
          createdAt: Between(query.startDate, query.endDate),
        },
      };
    }
    return this.stripePaymentsRepository.readAllEntities(options);
  }

  async createStripePayment(paymentIdHash: string): Promise<CreatePaymentResponseDTO> {
    const isPreProcessingExist = await this.getPaymentByStatus(TransactionsStatusEnum.PRE_PROCESSING);
    if (isPreProcessingExist) {
      throw new BadRequestException('There is an unfinished payout. Please complete or cancel it');
    }

    const payoutAmount = await this.transactionsService.getPayoutAmount(paymentIdHash);
    const amount = Math.floor(payoutAmount.total * this.config.percentDenominator);
    const stripePayment = await this.getStripePaymentByPaymentId(paymentIdHash);
    await this.stripePaymentsRepository.updateEntity(stripePayment.id, { status: TransactionsStatusEnum.PRE_PROCESSING, });
    const payment = await this.stripeApiService.createStripePayment(amount, stripePayment.id);
    if (!payment) {
      await this.stripePaymentsRepository.updateEntity(stripePayment.id, { status: TransactionsStatusEnum.FAIL, });
    }
    const transactionIds = await this.transactionsService.getTransactionIds(stripePayment);
    await this.transactionsService.updateStatus(transactionIds, TransactionsStatusEnum.PRE_PROCESSING);
    if (!payment?.url) {
      await this.stripePaymentsRepository.updateEntity(stripePayment.id, { status: TransactionsStatusEnum.FAIL, });
    }
    return { paymentLink: payment.url, };
  }

  async cancelUncompletedPayout(): Promise<BaseMessageDTO> {
    const stripePayment = await this.getPaymentByStatus(TransactionsStatusEnum.PRE_PROCESSING);
    const transactionIds = await this.transactionsService.getTransactionIds(stripePayment);
    await this.transactionsService.updateStatus(transactionIds, TransactionsStatusEnum.PENDING);
    await this.transactionsService.setStripePaymentId({ id: In(transactionIds), }, null);
    await this.stripePaymentsRepository.delete(stripePayment.id);
    return { message: 'Uncompleted payout successful canceled', };
  }

  async getPaymentStatus(): Promise<PaymentStatusDTO> {
    return { status: !await this.getPaymentByStatus(TransactionsStatusEnum.PRE_PROCESSING), };
  }

  async getPaymentLink(): Promise<CreatePaymentResponseDTO> {
    const preProcessingPayment = await this.getPaymentByStatus(TransactionsStatusEnum.PRE_PROCESSING);
    if (!preProcessingPayment) {
      throw new BadRequestException('You have no unfinished payout');
    }
    const payoutAmount = await this.transactionsService.readPayoutAmount(preProcessingPayment.id, TransactionsStatusEnum.PRE_PROCESSING);
    const amount = Math.floor(payoutAmount.amount + this.config.stripeConfig.fee * this.config.percentDenominator);
    const payment = await this.stripeApiService.createStripePayment(amount, preProcessingPayment.id);
    if (!payment?.url) {
      await this.stripePaymentsRepository.updateEntity(preProcessingPayment.id, { status: TransactionsStatusEnum.FAIL, });
    }
    return { paymentLink: payment.url, };
  }

  createTemporaryRecord(paymentId: string): Promise<StripePayments> {
    return this.stripePaymentsRepository.createEntity({ paymentId, status: TransactionsStatusEnum.PENDING, });
  }

  async getStripePaymentByPaymentId(paymentId: string): Promise<StripePayments> {
    const stripePayment = await this.stripePaymentsRepository.readEntity({ where: { paymentId, }, });
    if (!stripePayment) {
      throw new NotFoundException('Stripe payment with this hash not found');
    }
    return stripePayment;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async stripeWebhook(event: StripeWebhookDTO, signature: string): Promise<void> {
    if (event) {
      switch (event.type) {
      case 'checkout.session.async_payment_succeeded':
        await this.paymentProcessing(event.data.object as IPaymentProcessing);
        break;
      case 'transfer.created':
        await this.successesTransfer(event.data.object as ITransfer);
        break;
      case 'payment_intent.requires_action':
        await this.setProcessingStatus(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        await this.serPreProcessingStatus(event.data.object.id);
        break;
      default:
        this.logger.warn(`Unhandled event type ${event.type}.`);
      }
    }
  }

  async setProcessingStatus(paymentId: string): Promise<void> {
    const stripePayment = await this.getPaymentByStatus(TransactionsStatusEnum.PRE_PROCESSING);
    if (stripePayment) {
      await this.stripePaymentsRepository.update(
        { id: stripePayment.id, status: Not(TransactionsStatusEnum.SUCCESSES), },
        { status: TransactionsStatusEnum.PROCESSING, paymentId, }
      );
      const transactionIds = await this.transactionsService.getTransactionIds(stripePayment);
      await this.transactionsService.updateStatus(transactionIds, TransactionsStatusEnum.PROCESSING);
    }
  }

  async serPreProcessingStatus(paymentId: string): Promise<void> {
    const stripePayment = await this.getPaymentByStatus(TransactionsStatusEnum.PROCESSING);
    if (stripePayment) {
      await this.stripePaymentsRepository.update(
        { id: stripePayment.id, status: Not(TransactionsStatusEnum.SUCCESSES), },
        { status: TransactionsStatusEnum.PRE_PROCESSING, paymentId, }
      );
      const transactionIds = await this.transactionsService.getTransactionIds(stripePayment);
      await this.transactionsService.updateStatus(transactionIds, TransactionsStatusEnum.PRE_PROCESSING);
    }
  }

  getPaymentByStatus(status: TransactionsStatusEnum): Promise<StripePayments> {
    return this.stripePaymentsRepository.readEntity({ where: { status, }, });
  }

  async getSetStripePaymentId(paymentId: string, id: number): Promise<StripePayments> {
    let stripePayment = null;
    if (paymentId && !id) {
      stripePayment = await this.createTemporaryRecord(paymentId);
    }
    if (id) {
      stripePayment = await this.stripePaymentsRepository.updateEntity(id, { paymentId, });
    }
    return stripePayment;
  }

  private async paymentProcessing(body: IPaymentProcessing): Promise<void> {
    if (body.status != 'complete' || body.payment_status != 'paid') {
      //await this.stripeApiService.refund();
    }
    const stripePayment = await this.stripePaymentsRepository.readEntityById(body.metadata.internalStripePaymentId);
    if (!stripePayment) {
      this.logger.log(`PaymentIntent ${body.id} was failed!`);
      await this.stripePaymentsRepository.updateEntity(body.metadata.internalStripePaymentId, {
        status: TransactionsStatusEnum.FAIL,
      });
    }
    const paymentIntent = await this.stripeApiService.getPaymentIntent(body.payment_intent);
    const [ charge, ] = paymentIntent.charges.data ;
    await this.stripePaymentsRepository.updateEntity(stripePayment.id, {
      chargeId: charge.id,
      status: TransactionsStatusEnum.SUCCESSES,
      deliveredAt: DateTime.utc(),
    });

    this.logger.log(`PaymentIntent ${body.payment_intent} was successful!`);
    await this.createTransfers(stripePayment);
  }

  private async createTransfers(stripePayment: StripePayments): Promise<void> {
    const transactions = await this.transactionsService.getByStripePayment(stripePayment);
    for (const transaction of transactions) {
      const user = await this.userService.readById(transaction.user.id, null, [ 'stripeAccountId', ]);
      await this.checkStripeAccountId(user.stripeAccountId);
      const transfers = await this.stripeApiService.transfers(user.stripeAccountId, transaction.stripePayment.chargeId, transaction.amount, transaction.id);
      if (!transfers) {
        this.logger.log(`Transfer ${JSON.stringify(transaction)} was failed!`);
        await this.transactionsService.updateStatus([ transaction.id, ], TransactionsStatusEnum.FAIL);
      }
      await this.transactionsService.setTransferId(transaction.id, transfers.id);
    }
  }

  private async successesTransfer(body: ITransfer): Promise<void> {
    const transactionId = body.metadata.transactionId;
    await this.transactionsService.updateStatus([ transactionId, ], TransactionsStatusEnum.SUCCESSES);
    this.logger.log(`Transactions id: ${transactionId} successes`);
  }

  private async checkStripeAccountId(stripeAccountId: string): Promise<void> {
    if (!stripeAccountId) {
      throw new NotFoundException('Stripe account for this user not found');
    }
    const account = await this.stripeApiService.getConnectedAccount(stripeAccountId);
    if (!account) {
      throw new BadRequestException('Something is wrong with your stripe account, contact technical support please');
    }
  }
}
