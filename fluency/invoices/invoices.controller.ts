import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BaseController, BaseQueryDTO, BaseUserIdQueryDTO } from '../common/base';
import { Access, AuthGuard, Roles } from '../common/decorators';
import { InvoicesService } from './invoices.service';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import {
  GetAllInvoicesAdminResponseDTO,
  GetAllInvoicesDTO,
  GetAllInvoicesUserResponseDTO,
  UpdateInvoicesDTO
} from './DTO';
import { UpdateInvoicesResponseDTO } from './DTO/update-invoices-response.dto';

@AuthGuard()
@ApiBearerAuth()
@Controller('invoice')
@ApiTags('Invoices')
export class InvoicesController extends BaseController {
  constructor(private readonly invoicesService: InvoicesService) {
    super();
  }

  @ApiOkResponse({ description: 'Returns user\'s invoices', type: [ GetAllInvoicesAdminResponseDTO, ], })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.FINANCIAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('all/admin')
  readAllByAdmin(@AuthUser() admin: Person, @Query() query: GetAllInvoicesDTO): Promise<Array<GetAllInvoicesAdminResponseDTO>> {
    return this.invoicesService.readAllByAdmin(query);
  }

  @ApiOkResponse({ description: 'Returns user\'s invoices', type: [ GetAllInvoicesUserResponseDTO, ], })
  @Get('history')
  readAllByUser(@AuthUser() person: Person, @Query() query: BaseUserIdQueryDTO): Promise<Array<GetAllInvoicesUserResponseDTO>> {
    return this.invoicesService.readAllByUser(person, query.userId);
  }

  @ApiOkResponse({ description: 'Return updated invoice', type: UpdateInvoicesResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.FINANCIAL, ])
  @Access(AccessEnum.ADMIN)
  @Put()
  update(@AuthUser() person: Person, @Query() query: BaseQueryDTO, @Body() body: UpdateInvoicesDTO): Promise<UpdateInvoicesResponseDTO> {
    return this.invoicesService.update(person, query.id, body);
  }
}
