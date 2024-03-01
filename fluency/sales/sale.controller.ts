import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { BaseController, BaseUserIdQueryDTO } from '../common/base';
import { BaseGroupQueryDTO, StaticsResponseDTO, TimeRangeQueryDTO, TotalResponseDTO } from '../common/DTO';
import { AccessEnum } from '../common/enums';
import { Access, AuthGuard } from '../common/decorators';
import { Person } from '../auth/models';
import { AuthUser } from '../auth/decorators';
import { SaleService } from './sale.service';
import {
  GetAllByAdminResponseDTO,
  GroupStatisticsResponseDTO,
  SaleHistoryResponseDTO, SaleResponseDTO,
  TestLevelRequestDTO,
  TestLevelResponseDTO,
  UserLevelResponseDTO,
  SortingSalesOptionsDTO,
  GetAllAdminQueryDTO
} from './DTO';
import { HotmartTransactionCodeQueryDTO } from './DTO/hotmart-transaction-code-query.dto';

@Controller('sales')
@ApiTags('Sales')
export class SaleController extends BaseController {
  constructor(private readonly salesService: SaleService) {
    super();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @Access(AccessEnum.USER)
  @ApiOkResponse({ description: 'Returns user\'s sales by date', type: SaleHistoryResponseDTO, })
  @Get('summary')
  getSaleSummary(@AuthUser() user: Person, @Query() query: TimeRangeQueryDTO): Promise<SaleHistoryResponseDTO> {
    return this.salesService.getSaleSummary(user.userId, query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @Access(AccessEnum.USER)
  @ApiOkResponse({ description: 'Returns all user\'s sales', type: [ SaleResponseDTO, ], })
  @Get('all')
  readAll(@AuthUser() user: Person, @Query() query: SortingSalesOptionsDTO): Promise<Array<SaleResponseDTO>> {
    return this.salesService.readAll(user.userId, query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @Access(AccessEnum.ADMIN)
  @ApiOkResponse({ description: 'Returns all sales', type: [ GetAllByAdminResponseDTO, ], })
  @Get('all/admin')
  readAllByAdmin(@AuthUser() user: Person, @Query() query: GetAllAdminQueryDTO): Promise<Array<GetAllByAdminResponseDTO>> {
    return this.salesService.readAllByAdmin(query);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns all children sales', type: [ SaleResponseDTO, ], })
  @Access(AccessEnum.USER)
  @Get('child')
  readChildByHotmartTransactionCode(@AuthUser() user: Person, @Query() query: HotmartTransactionCodeQueryDTO): Promise<Array<SaleResponseDTO>> {
    return this.salesService.readChildByHotmartTransactionCode(query.hotmartTransactionCode, user.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns all children sales', type: [ SaleResponseDTO, ], })
  @Access(AccessEnum.ADMIN)
  @Get('child/admin')
  readChildByHotmartTransactionCodeByAdmin(@AuthUser() person: Person, @Query() query: HotmartTransactionCodeQueryDTO): Promise<Array<SaleResponseDTO>> {
    return this.salesService.readChildByHotmartTransactionCode(query.hotmartTransactionCode);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user\'s level', type: UserLevelResponseDTO, })
  @Access(AccessEnum.USER)
  @Get('user-level')
  getUserLevel(@AuthUser() user: Person): Promise<UserLevelResponseDTO> {
    return this.salesService.getOneUserLevel(user.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user\'s sales statistics', type: GroupStatisticsResponseDTO, })
  @Get('user-statistics')
  readUsersStatistics(@Query() query: BaseUserIdQueryDTO): Promise<GroupStatisticsResponseDTO> {
    return this.salesService.readUsersSalesStatistics(query.userId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns group\'s sales statistics', type: GroupStatisticsResponseDTO, })
  @Get('group-statistics')
  readGroupStatistics(@Query() query: BaseGroupQueryDTO): Promise<GroupStatisticsResponseDTO> {
    return this.salesService.readGroupSalesStatistics(query.groupId);
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of users sales', type: StaticsResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-sales')
  readNumberOfSales(): Promise<StaticsResponseDTO> {
    return this.salesService.getNumberOfSales();
  }

  @AuthGuard()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns number of users sales for today', type: TotalResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('statistics/number-sales/today')
  readNumberOfSalesToday(): Promise<TotalResponseDTO> {
    return this.salesService.getNumberOfSalesToday();
  }

  @ApiBody({ type: TestLevelRequestDTO, isArray: true, })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Returns test level', type: TestLevelResponseDTO, })
  @Post('test')
  test(@Body() body: Array<TestLevelRequestDTO>): TestLevelResponseDTO {
    return this.salesService.test(body);
  }
}
