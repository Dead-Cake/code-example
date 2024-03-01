import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PixService } from './pix.service';
import { Access, AuthGuard } from '../common/decorators';
import { BaseController, BaseMessageDTO, BaseQueryDTO } from '../common/base';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';
import { AccessEnum } from '../common/enums';
import { PixResponseDTO, CreatePixDTO } from './DTO';

//PIX Brazil payment system
@AuthGuard()
@ApiBearerAuth()
@Controller('pix')
@ApiTags('Pix')
export class PixController extends BaseController {
  constructor(
    private readonly pixService: PixService
  ) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns created pix', type: PixResponseDTO, })
  @Access(AccessEnum.USER)
  @Post()
  create(@AuthUser() user: Person, @Body() body: CreatePixDTO): Promise<PixResponseDTO> {
    return this.pixService.create(user.userId, body);
  }

  @ApiOkResponse({ description: 'Returns created pix', type: PixResponseDTO, })
  @Access(AccessEnum.USER)
  @Put()
  update(@AuthUser() user: Person, @Body() body: CreatePixDTO): Promise<PixResponseDTO> {
    return this.pixService.update(user.userId, body);
  }

  @ApiOkResponse({ description: 'Returns pix', type: PixResponseDTO, })
  @Access(AccessEnum.USER)
  @Get()
  read(@AuthUser() user: Person): Promise<PixResponseDTO> {
    return this.pixService.read(user.userId);
  }

  @ApiOkResponse({ description: 'Returns pix', type: PixResponseDTO, })
  @Access(AccessEnum.ADMIN)
  @Get('admin')
  readById(@AuthUser() admin: Person, @Query() query: BaseQueryDTO): Promise<PixResponseDTO> {
    return this.pixService.readById(query.id);
  }

  @ApiOkResponse({ description: 'Returns delete message', type: BaseMessageDTO, })
  @Access(AccessEnum.USER)
  @Delete()
  delete(@AuthUser() user: Person): Promise<BaseMessageDTO> {
    return this.pixService.delete(user.userId);
  }
}
