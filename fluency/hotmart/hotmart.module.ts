import { forwardRef, Module } from '@nestjs/common';

import { HotmartController } from './hotmart.controller';
import { LoggerService } from '../common/services';
import { HotmartService } from './hotmart.service';
import { SaleModule } from '../sales/sale.module';
import { UserModule } from '../users/user.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { SaleStatusHistoryModule } from '../sales-status-history/sale-status-history.module';
import { GroupUsersModule } from '../group-users/group-users.module';

@Module({
  controllers: [ HotmartController, ],
  providers: [ HotmartService, LoggerService, ],
  imports: [
    forwardRef(() => SaleModule),
    forwardRef(() => UserModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => SaleStatusHistoryModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => GroupUsersModule),
  ],
})
export class HotmartModule {}
