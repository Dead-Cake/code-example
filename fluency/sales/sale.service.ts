/* eslint-disable @typescript-eslint/no-magic-numbers */
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { GroupService } from '../groups/group.service';
import { UserService } from '../users/user.service';
import { SaleRepository } from './sale.repository';
import { Sale } from './sale.entity';
import {
  GetAllAdminQueryDTO,
  GetAllByAdminResponseDTO,
  GroupStatisticsResponseDTO,
  SaleHistoryResponseDTO,
  SaleResponseDTO, SortingSalesOptionsDTO,
  UserLevelResponseDTO
} from './DTO';
import { fullDate, maxSalesSummaryDuration, yearMonthDate } from '../common/constants';
import { StaticsResponseDTO, TimeRangeQueryDTO, TotalResponseDTO } from '../common/DTO';
import {
  DateUnitEnum,
  EnvironmentName,
  SalesStatusEnum,
  UserLevelEnum
} from '../common/enums';
import { getCurrentDateRange, getDateUnit } from '../common/utilities';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/interfaces';
import { AppConfigService } from '../common/services';
import { TransactionsService } from '../transactions/transactions.service';
import { SettingsService } from '../settings/settings.service';
import { dateRangeValid, maxDateRange } from '../common/validators';
import { User } from '../users/user.entity';
import { SaleStatusHistoryService } from '../sales-status-history/sale-status-history.service';
import { Between } from 'typeorm';
import { DateTime } from 'luxon';
import { CreateSales, Level, ManyLevels, ManyUsersLevel, UserLevel, UserSales } from './common/types';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    @Inject(forwardRef(() => SettingsService))
    private readonly settingsService: SettingsService,
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly configService: AppConfigService,
    @Inject(forwardRef(() => SaleStatusHistoryService))
    private readonly saleStatusHistoryService: SaleStatusHistoryService
  ) { }

  create(user: User, saleData: CreateSales): Promise<Sale> {
    return this.saleRepository.createEntity({ user, ...saleData, });
  }

  async update(id: number, status: SalesStatusEnum) : Promise<Sale> {
    const sale = await this.saleRepository.readEntityById(id);
    if (!sale) {
      throw new NotFoundException('Sale with id not found');
    }
    await this.saleRepository.update(id, { status, });
    return sale;
  }

  readAll(userId: number, query: SortingSalesOptionsDTO): Promise<Array<SaleResponseDTO>> {
    return this.saleRepository.readAll(userId, query);
  }

  readAllByAdmin(range: GetAllAdminQueryDTO): Promise<Array<GetAllByAdminResponseDTO>> {
    return this.saleRepository.readAllByAdmin(range);
  }

  async readChildByHotmartTransactionCode(hotmartTransactionCode: string, userId?: number): Promise<Array<SaleResponseDTO>> {
    let options;
    options = { hotmartTransactionCode, };
    if (userId) {
      const user = await this.userService.readById(userId);
      options = { ...options, user, };
    }
    const sale = await this.saleRepository.readEntity({ where: options, });
    const salesHistory = await this.saleStatusHistoryService.getHistoryBySale(sale);
    const transaction = await this.transactionsService.getUserTransactionBySale(sale);
    salesHistory.shift();
    return salesHistory.map(s => {
      return {
        ...sale,
        ...s,
        commission: transaction.amount,
        purchaseDate: sale.createdAt,
        price: sale.price / 100,
      };
    });
  }

  async getSaleSummary(userId: number, range: TimeRangeQueryDTO): Promise<SaleHistoryResponseDTO> {
    dateRangeValid(range.startDate, range.endDate);
    maxDateRange(range.startDate, range.endDate, maxSalesSummaryDuration);
    const history = await this.saleRepository.getSaleHistory(
      range.startDate,
      range.endDate,
      userId
    );
    return {
      history,
      total: history
        .map((item) => item.numberOfSales)
        .reduce((prev, next) => prev + next),
    };
  }

  async readUsersSalesStatistics(userId: number): Promise<GroupStatisticsResponseDTO> {
    const user = await this.userService.readById(userId);
    const [ totalSales, ] = await this.saleRepository.readNumberOfSales(user);
    const [ currentYearSales, ] = await this.saleRepository.readNumberOfSales(user, getCurrentDateRange(DateUnitEnum.YEAR).startDate);
    return {
      currentYearSales: currentYearSales.salesNumber,
      totalSales: totalSales.salesNumber,
      currentYear: getDateUnit(DateUnitEnum.YEAR),
    };
  }

  async readGroupSalesStatistics(groupId: number): Promise<GroupStatisticsResponseDTO> {
    const group = await this.groupService.read(groupId);
    const startOfYear = getCurrentDateRange(DateUnitEnum.YEAR).startDate;
    const currentYearSales = await this.saleRepository.getSalesSummary(group.id, startOfYear);
    const totalSales = await this.saleRepository.getSalesSummary(group.id);
    const currentYear = getDateUnit(DateUnitEnum.YEAR);
    return {
      currentYearSales,
      currentYear,
      totalSales,
    };
  }

  async getNumberOfSales(): Promise<StaticsResponseDTO> {
    const weekResult = await this.saleRepository.getNumberOfSales(
      getCurrentDateRange(DateUnitEnum.WEEK),
      DateUnitEnum.DAY,
      fullDate
    );
    const monthResult = await this.saleRepository.getNumberOfSales(
      getCurrentDateRange(DateUnitEnum.MONTH),
      DateUnitEnum.DAY,
      fullDate
    );
    const yearResult = await this.saleRepository.getNumberOfSales(
      getCurrentDateRange(DateUnitEnum.YEAR),
      DateUnitEnum.MONTH,
      yearMonthDate
    );
    return {
      week: weekResult.map(value => value.numberOfSales),
      month: monthResult.map(value => value.numberOfSales),
      year: yearResult.map(value => value.numberOfSales),
    };
  }

  async getNumberOfSalesToday(): Promise<TotalResponseDTO> {
    const day = getCurrentDateRange(DateUnitEnum.DAY);
    const [ total, ] = await this.saleRepository.readNumberOfSales(null, day.startDate);
    return { total: total.salesNumber, };
  }

  async getUsersLevel(userIds: Array<number>): Promise<Array<ManyUsersLevel>> {
    await this.userService.getMany(userIds);
    const historyFromDb = await this.saleRepository.getUsersSalesByWeek(
      userIds
    );
    const history: Record<number, Array<UserSales>> = {};
    historyFromDb.forEach((item) => {
      const { id, ...sale } = item;
      if (id in history) {
        history[id].push(sale);
      } else {
        history[id] = [ sale, ];
      }
    });
    const userLevels: Array<ManyUsersLevel> = [];
    Object.keys(history).forEach(userId => {
      const id = parseInt(userId, 10);
      const historyItem = history[id];
      const userLevelItem = this.getUserLevelByWeeklySalesHistory(historyItem);
      userLevels.push({ ...userLevelItem, id, });
    });
    return userIds.map(id =>
      userLevels.find(level => level.id === id) ?? { id, ...this.configService.salesSetting.firstLevel, });
  }

  async getOneUserLevel(userId: number): Promise<UserLevelResponseDTO> {
    const [ levelData, ] = await this.getUsersLevel([ userId, ]);
    return levelData;
  }


  async getSale(user: User, hotmartTransactionCode: string, productId: string, status?: unknown, exception?: boolean): Promise<Sale> {
    let options;
    options = { user, hotmartTransactionCode, productId, };
    if (status) {
      options = { ...options, status, };
    }
    const sale = await this.saleRepository.readEntity({ where: options, order: { createdAt: 'DESC', }, });
    if (!sale && exception) {
      throw new BadRequestException('Sale for this event dont exist');
    }
    return sale;
  }

  test(history: Array<UserSales>): UserLevel {
    if (
      this.configService.environment === EnvironmentName.STAGE ||
      this.configService.environment === EnvironmentName.PROD
    ) {
      throw new NotFoundException('Not found');
    }
    return this.getUserLevelByWeeklySalesHistory(history);
  }

  async getCommissionValue(user: User, price: number, creatorId?: number): Promise<number> {
    const { level, } = await this.getOneUserLevel(user.id);
    let amount = this.calculateCommission(this.settingsService.getCommission(level).direct, price);
    if (creatorId) {
      const creatorLevel = await this.getOneUserLevel(creatorId);
      amount = this.calculateCommission(this.settingsService.getCommission(creatorLevel.level).indirect, price);
    }
    return amount;
  }

  async checkSubscriptions(user: User, productId: string, clientName: string): Promise<void> {
    const sale = await this.saleRepository.readEntity({ where: {
      user,
      productId,
      clientName,
      createdAt: Between(DateTime.utc(), DateTime.utc().minus({ month: 12, })),
    },
    });
    if (sale) {
      throw new BadRequestException('This Sale already counting');
    }
  }

  private calculateCommission(levelPercent: number, price: number): number {
    const standardPrice = this.configService.commission.standardPrice;
    const discountPrice = this.configService.commission.discountPrice;
    if (discountPrice && price < discountPrice + 100 && price > discountPrice - 100) {
      return levelPercent * standardPrice / this.configService.percentDenominator * 12;
    }
    return levelPercent * price / this.configService.percentDenominator * 12;
  }
}
