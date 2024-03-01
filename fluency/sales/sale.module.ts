import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupModule } from '../groups/group.module';
import { SaleController } from './sale.controller';
import { SaleRepository } from './sale.repository';
import { UserModule } from '../users/user.module';
import { SaleService } from './sale.service';
import { Sale } from './sale.entity';
import { AppConfigModule } from '../common/services/app-config.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { SettingsModule } from '../settings/settings.module';
import { SaleStatusHistoryModule } from '../sales-status-history/sale-status-history.module';

@Module({
  controllers: [ SaleController, ],
  providers: [ SaleService, ],
  imports: [
    TypeOrmModule.forFeature([ Sale, SaleRepository, ]),
    AppConfigModule,
    forwardRef(() => UserModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => GroupModule),
    forwardRef(() => SettingsModule),
    forwardRef(() => SaleStatusHistoryModule),
  ],
  exports: [ SaleService, ],
})
export class SaleModule {}
