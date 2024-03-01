import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';

import { HotmartWebhookRequestDTO } from './DTO';
import { BaseMessageDTO } from '../common/base';
import { LoggerService } from '../common/services';
import { SaleService } from '../sales/sale.service';
import { decodeBase64 } from '../common/utilities';
import { UserService } from '../users/user.service';
import { IUserId } from '../common/interface';
import { SalesStatusEnum, TransactionsStatusEnum, TransactionsTypeEnum } from '../common/enums';
import { In } from 'typeorm';
import { GroupUsersService } from '../group-users/group-users.service';
import { User } from '../users/user.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { SaleStatusHistoryService } from '../sales-status-history/sale-status-history.service';
import { CreateSales } from '../sales/common/types';

@Injectable()
export class HotmartService {
  constructor(
    private readonly loggerService: LoggerService,
    @Inject(forwardRef(() => SaleService))
    private readonly saleService: SaleService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => GroupUsersService))
    private readonly groupUsersService: GroupUsersService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    @Inject(forwardRef(() => SaleStatusHistoryService))
    private readonly saleStatusHistoryService: SaleStatusHistoryService) {
  }

  async webhookRequestEvent(body: HotmartWebhookRequestDTO): Promise<BaseMessageDTO> {
    const src = decodeBase64<IUserId>(body.src, 'src');
    if (!src || !src.key) {
      throw new BadRequestException('Invalid src');
    }
    const user = await this.userService.readByUniqKey(src.key);
    if (body.recurrency > 1) {
      throw new BadRequestException('This Sale already counting');
    }

    await this.webhookProcessing(user, {
      clientName: body.name,
      clientEmail: body.email,
      clientPhoneNumber: body.phoneNumber,
      clientCountry: body.addressCountry,
      clientState: body.addressState,
      clientCity: body.addressCity,
      clientDistrict: body.addressDistrict,
      productName: body.prodName,
      productId: body.prod,
      status: body.status,
      price: body.price,
      currency: body.currency,
      hotmartTransactionCode: body.transaction,
      recurrencyPeriod: body.recurrencyPeriod,
      paymentType: body.paymentType,
      warrantyDate: body.warrantyDate,
    });

    return { message: 'Hook was successfully received', };
  }

  private async webhookProcessing(user: User, body: CreateSales): Promise<void> {
    const creator = await this.groupUsersService.getGroupCreatorByMemberId(user);
    const amount = await this.saleService.getCommissionValue(user, body.price);
    switch (body.status) {
    case SalesStatusEnum.APPROVED:
      const isHotmartTransactionCodeExists = await this.saleService.getSale(user, body.hotmartTransactionCode, body.productId);
      if (isHotmartTransactionCodeExists) {
        throw new BadRequestException('Sale with this hotmartTransactionCode already exists');
      }
      await this.saleService.checkSubscriptions(user, body.productId, body.clientName);
      const createdSale = await this.saleService.create(user, { ...body, });
      const transactionEntity = {
        type: TransactionsTypeEnum.REFILL,
        currency: body.currency,
        status: TransactionsStatusEnum.PENDING,
        sale: createdSale,
      };
      await this.transactionsService.create({ ...transactionEntity, user, amount, });
      if (creator) {
        await this.transactionsService.create({
          ...transactionEntity,
          user: creator,
          amount: await this.saleService.getCommissionValue(user, body.price, creator?.id),
          isLeader: true,
        });
      }
      await this.saleStatusHistoryService.create(SalesStatusEnum.APPROVED, createdSale);
      break;
    case SalesStatusEnum.COMPLETED:
      const sale = await this.saleService.getSale(user, body.hotmartTransactionCode, body.productId, In([ SalesStatusEnum.APPROVED, SalesStatusEnum.DISPUTE, ]), true);
      if (sale.status === SalesStatusEnum.APPROVED) {
        const transactionsId = await this.transactionsService.getTransactionsIdBySale(sale);
        await this.transactionsService.updateStatus(transactionsId, TransactionsStatusEnum.SUCCESSES);
      }
      await this.saleStatusHistoryService.create(SalesStatusEnum.COMPLETED, sale);
      await this.saleService.update(sale.id, SalesStatusEnum.COMPLETED);
      break;
    case SalesStatusEnum.REFUNDED:
      const refundedSale = await this.saleService.getSale(user, body.hotmartTransactionCode, body.productId, In([ SalesStatusEnum.APPROVED, SalesStatusEnum.DISPUTE, ]), true);
      if (refundedSale.status === SalesStatusEnum.DISPUTE) {
        const transactionEntity = {
          type: TransactionsTypeEnum.REFUND,
          currency: body.currency,
          status: TransactionsStatusEnum.SUCCESSES,
          sale: refundedSale,
        };
        await this.transactionsService.create({ ...transactionEntity,
          user,
          amount: await this.saleService.getCommissionValue(user, refundedSale.price),
        });
        if (creator) {
          await this.transactionsService.create({
            ...transactionEntity,
            user: creator,
            amount: await this.saleService.getCommissionValue(user, refundedSale.price, creator.id),
            isLeader: true,
          });
        }
      }
      await this.saleStatusHistoryService.create(SalesStatusEnum.REFUNDED, refundedSale);
      await this.saleService.update(refundedSale.id, SalesStatusEnum.REFUNDED);
      break;
    case SalesStatusEnum.DISPUTE:
      const completedSale = await this.saleService.getSale(user, body.hotmartTransactionCode, body.productId, SalesStatusEnum.COMPLETED, true);
      await this.saleStatusHistoryService.create(SalesStatusEnum.DISPUTE, completedSale);
      await this.saleService.update(completedSale.id, SalesStatusEnum.DISPUTE);
      break;
    }
  }
}
