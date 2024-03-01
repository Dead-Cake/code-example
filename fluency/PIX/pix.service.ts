import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CreatePixDTO, PixResponseDTO } from './DTO';
import { PixValidator } from './pix.validator';
import { PixRepository } from './pix.repository';
import { UserService } from '../users/user.service';
import { BankAccountService } from '../bank-accounts/bank-account.service';
import { Pix } from './pix.entity';
import { BaseMessageDTO } from '../common/base';
import { User } from '../users/user.entity';
import { PixKeyEnum } from '../common/enums';

@Injectable()
export class PixService {
  constructor(
    private readonly pixRepository: PixRepository,
    private readonly pixValidator: PixValidator,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => BankAccountService))
    private readonly bankAccountService: BankAccountService
  ) { }

  async create(userId: number, body: CreatePixDTO): Promise<PixResponseDTO> {
    this.pixValidator.validate(body);
    let bankAccount = null;
    const user = await this.userService.readById(userId);
    const existsPix = await this.getPixByUser(user);
    if (existsPix) {
      throw new BadRequestException('Pix already exists');
    }
    const { agency, accountNumber, stateId, city, bankId, ...pixEntity } = body;
    if (body.key === PixKeyEnum.BANK_ACCOUNT) {
      bankAccount = await this.bankAccountService.createOrUpdateForPix({ accountNumber, agency, bankId, stateId, city, });
    }
    const pix = await this.pixRepository.createEntity({ user, bankAccount, ...pixEntity, });
    return { ...bankAccount, ...pix, };
  }

  async update(userId: number, body: CreatePixDTO): Promise<PixResponseDTO> {
    this.pixValidator.validate(body);
    let bankAccount = null;
    const user = await this.userService.readById(userId);
    const pix = await this.getPixByUser(user, true);
    if (pix.key === PixKeyEnum.BANK_ACCOUNT && body.key != PixKeyEnum.BANK_ACCOUNT) {
      await this.bankAccountService.deleteForPix(pix.bankAccount.id);
    }
    const { agency, accountNumber, stateId, city, bankId, ...pixEntity } = body;
    if (body.key === PixKeyEnum.BANK_ACCOUNT) {
      bankAccount = await this.bankAccountService.createOrUpdateForPix({ accountNumber, agency, bankId, stateId, city, }, pix.bankAccount?.id);
    }
    const updatedPix = await this.pixRepository.updateEntity(pix.id, { user, bankAccount, ...pixEntity, });
    return { ...bankAccount, ...updatedPix, };
  }

  async read(userId: number): Promise<PixResponseDTO> {
    const user = await this.userService.readById(userId);
    const [ pix, ] = await this.pixRepository.readPix(user.id);
    return pix ?? null;
  }

  async readById(id: number): Promise<PixResponseDTO> {
    const [ pix, ] = await this.pixRepository.readPixById(id);
    if (!pix) {
      throw new NotFoundException('Pix with this id not found.');
    }
    return pix;
  }

  async delete(userId: number): Promise<BaseMessageDTO> {
    const user = await this.userService.readById(userId);
    const pix = await this.getPixByUser(user, true);
    if (pix.bankAccount) {
      await this.bankAccountService.deleteForPix(pix.bankAccount.id);
    }
    await this.pixRepository.softDeleteEntity(pix.id);
    return { message: 'The entity was successfully deleted', };
  }

  private async getPixById(id: number, relations?: Array<string>): Promise<Pix> {
    let options;
    if (relations) {
      options = { relations, };
    }
    const pix = await this.pixRepository.readEntityById(id, options);
    if (!pix) {
      throw new NotFoundException('Pix with this id not found.');
    }
    return pix;
  }

  private async getPixByUser(user: User, exception?: boolean): Promise<Pix> {
    const pix = await this.pixRepository.readEntity({ where: { user, }, relations: [ 'bankAccount', ], });
    if (exception && !pix) {
      throw new NotFoundException('Pix with this not found.');
    }
    return pix;
  }
}
