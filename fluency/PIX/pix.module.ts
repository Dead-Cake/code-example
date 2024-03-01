import { forwardRef, Module } from '@nestjs/common';

import { PixController } from './pix.controller';
import { PixService } from './pix.service';
import { UserModule } from '../users/user.module';
import { BankAccountModule } from '../bank-accounts/bank-account.module';
import { PixValidator } from './pix.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pix } from './pix.entity';
import { PixRepository } from './pix.repository';

@Module({
  controllers: [ PixController, ],
  providers: [ PixService, PixValidator, ],
  imports: [
    TypeOrmModule.forFeature([ Pix, PixRepository, ]),
    forwardRef(() => UserModule),
    forwardRef(() => BankAccountModule),
  ],
  exports: [ PixService, ],
})
export class PixModule {}
