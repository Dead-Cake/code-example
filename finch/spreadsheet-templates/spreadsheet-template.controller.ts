import { Controller, Post, Get, Put, Delete, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { Access, Permissions } from '../common/decorators';
import { AuthGuard } from '../auth/common/decorators';
import { BaseMessageDto, BaseQueryDto, BaseController } from '../common';
import {
  CreateSpreadsheetTemplateDto,
  GetAllSpreadsheetTemplatesDto,
  MultipleOperationsOnSpreadsheetTemplatesDto,
  SpreadsheetTemplateResponseDto,
  UpdateSpreadsheetTemplateDto
} from './DTO';
import { SpreadsheetTemplateService } from './spreadsheet-template.service';
import { Permission as PermissionsEnum } from '../common/enums/permissions';
import { Access as AccessEnum } from '../common/enums/general';
import { Context, GenericContext } from '../context';

@Controller('spreadsheet-template')
@ApiTags('Spreadsheet template')
@AuthGuard()
@ApiBearerAuth()
export class SpreadsheetTemplateController extends BaseController {
  constructor (private readonly spreadsheetTemplateService: SpreadsheetTemplateService) {
    super();
  }

  @ApiOperation({ deprecated: true, })
  @ApiCreatedResponse({ description: 'Spreadsheet template was successfully created', type: SpreadsheetTemplateResponseDto, })
  @Post()
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  create (@Context() context: GenericContext, @Body() spreadsheetTemplate: CreateSpreadsheetTemplateDto): Promise<SpreadsheetTemplateResponseDto> {
    return this.spreadsheetTemplateService.create(context, spreadsheetTemplate);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Returns the found Spreadsheet template', type: SpreadsheetTemplateResponseDto, })
  @Get()
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  read (@Context() context: GenericContext, @Query() query: BaseQueryDto): Promise<SpreadsheetTemplateResponseDto> {
    return this.spreadsheetTemplateService.read(context, query.id);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Returns list of Spreadsheet templates', type: [ SpreadsheetTemplateResponseDto, ], })
  @Get('all')
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  readAll (@Context() context: GenericContext, @Query() query: GetAllSpreadsheetTemplatesDto): Promise<Array<SpreadsheetTemplateResponseDto>> {
    return this.spreadsheetTemplateService.readAll(context, query);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Spreadsheet template was successfully updated', type: SpreadsheetTemplateResponseDto, })
  @Put()
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  update (@Context() context: GenericContext, @Query() query: BaseQueryDto, @Body() spreadsheetTemplate: UpdateSpreadsheetTemplateDto): Promise<SpreadsheetTemplateResponseDto> {
    return this.spreadsheetTemplateService.update(context, query.id, spreadsheetTemplate);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Spreadsheet templates was successfully deleted', type: BaseMessageDto, })
  @Delete()
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  delete (@Context() context: GenericContext, @Body() body: MultipleOperationsOnSpreadsheetTemplatesDto): Promise<BaseMessageDto> {
    return this.spreadsheetTemplateService.delete(context, body.ids);
  }

  @ApiOperation({ deprecated: true, })
  @ApiCreatedResponse({ description: 'The Spreadsheet template has been duplicated successfully', type: BaseMessageDto, })
  @Post('duplicate')
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  duplicate (@Context() context: GenericContext, @Query() query: BaseQueryDto): Promise<BaseMessageDto> {
    return this.spreadsheetTemplateService.copyOrDuplicate(context, query.id, true);
  }

  @ApiOperation({ deprecated: true, })
  @ApiCreatedResponse({ description: 'The Spreadsheet template has been copied successfully', type: BaseMessageDto, })
  @Post('copy')
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  copy (@Context() context: GenericContext, @Query() query: BaseQueryDto): Promise<BaseMessageDto> {
    return this.spreadsheetTemplateService.copyOrDuplicate(context, query.id, false);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Spreadsheet templates was successfully shared', type: BaseMessageDto, })
  @Put('share')
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  share (@Context() context: GenericContext, @Body() body: MultipleOperationsOnSpreadsheetTemplatesDto): Promise<BaseMessageDto> {
    return this.spreadsheetTemplateService.shareOrUnshare(context, body.ids, true);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Spreadsheet templates was successfully unshared', type: BaseMessageDto, })
  @Put('unshare')
  @Permissions(PermissionsEnum.SPREADSHEET_TEMPLATE_MANAGE)
  @Access(AccessEnum.USER)
  unshare (@Context() context: GenericContext, @Body() body: MultipleOperationsOnSpreadsheetTemplatesDto): Promise<BaseMessageDto> {
    return this.spreadsheetTemplateService.shareOrUnshare(context, body.ids, false);
  }
}
