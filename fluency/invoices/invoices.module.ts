import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesRepository } from './invoices.repository';
import { Invoice } from './invoices.entity';
import { FileModule } from '../files/file.module';
import { UsersDocumentsModule } from '../users-documents/users-documents.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  controllers: [ InvoicesController, ],
  providers: [ InvoicesService, ],
  imports: [
    TypeOrmModule.forFeature([ Invoice, InvoicesRepository, ]),
    UserModule,
    FileModule,
    forwardRef(() => UsersDocumentsModule),
    forwardRef(() => TransactionsModule),
  ],
  exports: [ InvoicesService, ],
})
export class InvoicesModule {}
