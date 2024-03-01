import { BadRequestException, Injectable } from '@nestjs/common';
import { cpf, cnpj } from 'cpf-cnpj-validator';

import { IManualValidator } from '../common/interface';
import { CreatePixDTO } from './DTO';
import { mustBeEmpty, mustBeNotEmpty } from '../common/validators/manual-validator';
import { PixKeyEnum } from '../common/enums';

@Injectable()
export class PixValidator implements IManualValidator<CreatePixDTO> {
  validate(data: CreatePixDTO): void {
    switch (data.key) {
    case PixKeyEnum.BANK_ACCOUNT:
      mustBeEmpty(data.cnpj, 'cnpj');
      mustBeEmpty(data.email, 'email');
      mustBeEmpty(data.phone, 'phone');
      mustBeEmpty(data.cpf, 'cpf');
      mustBeNotEmpty(data.bankId, 'bankId');
      mustBeNotEmpty(data.agency, 'agency');
      mustBeNotEmpty(data.accountNumber, 'accountNumber');
      mustBeNotEmpty(data.city, 'city');
      mustBeNotEmpty(data.stateId, 'stateId');
      break;
    case PixKeyEnum.CNPJ:
      mustBeNotEmpty(data.cnpj, 'cnpj');
      mustBeEmpty(data.email, 'email');
      mustBeEmpty(data.phone, 'phone');
      mustBeEmpty(data.cpf, 'cpf');
      mustBeEmpty(data.bankId, 'bankId');
      mustBeEmpty(data.agency, 'agency');
      mustBeEmpty(data.accountNumber, 'accountNumber');
      mustBeEmpty(data.city, 'city');
      mustBeEmpty(data.stateId, 'stateId');
      if (!cnpj.isValid(data.cnpj)) {
        throw new BadRequestException('cpf must be in valid format');
      }
      break;
    case PixKeyEnum.EMAIL:
      mustBeEmpty(data.cnpj, 'cnpj');
      mustBeNotEmpty(data.email, 'email');
      mustBeEmpty(data.phone, 'phone');
      mustBeEmpty(data.cpf, 'cpf');
      mustBeEmpty(data.bankId, 'bankId');
      mustBeEmpty(data.agency, 'agency');
      mustBeEmpty(data.accountNumber, 'accountNumber');
      mustBeEmpty(data.city, 'city');
      mustBeEmpty(data.stateId, 'stateId');
      break;
    case PixKeyEnum.PHONE:
      mustBeEmpty(data.cnpj, 'cnpj');
      mustBeEmpty(data.email, 'email');
      mustBeNotEmpty(data.phone, 'phone');
      mustBeEmpty(data.cpf, 'cpf');
      mustBeEmpty(data.bankId, 'bankId');
      mustBeEmpty(data.agency, 'agency');
      mustBeEmpty(data.accountNumber, 'accountNumber');
      mustBeEmpty(data.city, 'city');
      mustBeEmpty(data.stateId, 'stateId');
      break;
    case PixKeyEnum.CPF:
      mustBeEmpty(data.cnpj, 'cnpj');
      mustBeEmpty(data.email, 'email');
      mustBeEmpty(data.phone, 'phone');
      mustBeNotEmpty(data.cpf, 'cpf');
      mustBeEmpty(data.bankId, 'bankId');
      mustBeEmpty(data.agency, 'agency');
      mustBeEmpty(data.accountNumber, 'accountNumber');
      mustBeEmpty(data.city, 'city');
      mustBeEmpty(data.stateId, 'stateId');
      if (!cpf.isValid(data.cpf)) {
        throw new BadRequestException('cpf must be in valid format');
      }
      break;
    }
  }
}
