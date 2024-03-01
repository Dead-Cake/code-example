import { Controller, Post, Get, Put, Body, Query, Header } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { BaseQueryDto, BaseController } from '../common';
import { Access, Permissions } from '../common/decorators';
import { Permission as PermissionsEnum } from '../common/enums/permissions';
import { Access as AccessEnum } from '../common/enums/general';
import { AuthGuard } from '../auth/common/decorators';
import { CreateIndividualInsuranceDto, IndividualInsuranceResponseDto, UpdateIndividualInsuranceDto } from './DTO';
import { IndividualInsuranceService } from './individual-insurance.service';
import { Context, GenericContext } from '../context';

@Controller('individual-insurance')
@ApiTags('Individual insurance')
@AuthGuard()
@ApiBearerAuth()
export class IndividualInsuranceController extends BaseController {
  constructor (private readonly individualInsuranceService: IndividualInsuranceService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Individual insurance was successfully created', type: IndividualInsuranceResponseDto, })
  @Post()
  @Header('Cache-Control', 'private')
  @Permissions(PermissionsEnum.PATIENT_RECORD_INFO_EDIT)
  @Access(AccessEnum.USER)
  create (@Context() context: GenericContext, @Body() individualInsurance: CreateIndividualInsuranceDto): Promise<IndividualInsuranceResponseDto> {
    return this.individualInsuranceService.create(individualInsurance);
  }

  @ApiOkResponse({ description: 'Returns the found Individual insurance', type: IndividualInsuranceResponseDto, })
  @Get()
  @Header('Cache-Control', 'private')
  @Permissions(PermissionsEnum.PATIENT_RECORD_INFO_READ)
  @Access(AccessEnum.USER)
  read (@Context() context: GenericContext, @Query() query: BaseQueryDto): Promise<IndividualInsuranceResponseDto> {
    return this.individualInsuranceService.read(query.id);
  }

  @ApiOkResponse({ description: 'Individual insurance was successfully updated', type: IndividualInsuranceResponseDto, })
  @Put()
  @Header('Cache-Control', 'private')
  @Permissions(PermissionsEnum.PATIENT_RECORD_INFO_EDIT)
  @Access(AccessEnum.USER)
  update (@Context() context: GenericContext, @Query() query: BaseQueryDto, @Body() individualInsurance: UpdateIndividualInsuranceDto): Promise<IndividualInsuranceResponseDto> {
    return this.individualInsuranceService.update(query.id, individualInsurance);
  }
}
