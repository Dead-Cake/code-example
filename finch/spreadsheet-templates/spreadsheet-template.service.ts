import { BadRequestException, Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';

import { SpreadsheetTemplateRepository } from './spreadsheet-template.repository';
import {
  CreateSpreadsheetTemplateDto, GetAllSpreadsheetTemplatesDto,
  SpreadsheetTemplateResponseDto,
  UpdateSpreadsheetTemplateDto
} from './DTO';
import { getCreatedBy } from '../common/utilities/general';
import { BaseMessageDto } from '../common';
import { checkOrganizationContext, checkUserContext, GenericContext } from '../context';
import { SpreadsheetTemplateCategoryService } from '../spreadsheet-template-categories/spreadsheet-template-category.service';
import { SpreadsheetTemplateCategory } from '../spreadsheet-template-categories/spreadsheet-template-category.entity';
import { UserService } from '../users/user.service';
import { SpreadsheetTemplate } from './spreadsheet-template.entity';
import { SiteService } from '../sites/site.service';
import { LoggerService } from '../config/logger.service';

@Injectable()
export class SpreadsheetTemplateService {
  constructor (
    private readonly spreadsheetTemplateRepository: SpreadsheetTemplateRepository,
    @Inject(forwardRef(() => SpreadsheetTemplateCategoryService))
    private readonly spreadsheetTemplateCategoriesService: SpreadsheetTemplateCategoryService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SiteService))
    private readonly siteService: SiteService,
    private readonly logger: LoggerService
  ) { }

  async create (context: GenericContext, spreadsheetTemplate: CreateSpreadsheetTemplateDto): Promise<SpreadsheetTemplateResponseDto> {
    const category = await this.getCategory(spreadsheetTemplate.categoryId, context);
    const dataFromDB = await this.spreadsheetTemplateRepository.createEntity({
      ...spreadsheetTemplate,
      user: context.user,
      category,
    });
    const createdBy = getCreatedBy(context.user, context.user);
    return { ...dataFromDB, ...createdBy, categoryId: category ? category.id : null, };
  }

  async read (context: GenericContext, id: string): Promise<SpreadsheetTemplateResponseDto> {
    const dataFromDB = await this.getSpreadsheetTemplate(id, true, context);
    const { category, user, ...spreadsheetTemplate } = dataFromDB;
    const createdBy = getCreatedBy(user, context.user);
    return { ...spreadsheetTemplate, ...createdBy, categoryId: category ? category.id : null, };
  }

  async readAll (context: GenericContext, query: GetAllSpreadsheetTemplatesDto): Promise<Array<SpreadsheetTemplateResponseDto>> {
    await this.getCategory(query.categoryId, context);
    const sites = await this.siteService.getSitesByOrganization(context.organization);
    const siteIds = this.siteService.getSiteIds(sites);
    const spreadsheetTemplate = await this.spreadsheetTemplateRepository.readAllSpreadsheetTemplates(context, query, siteIds);

    return spreadsheetTemplate.map(spreadsheet => {
      const createdBy = getCreatedBy(spreadsheet.user, context.user);
      spreadsheet.user = undefined;
      const categoryId = spreadsheet.category.id;
      spreadsheet.category = undefined;

      return { ...spreadsheet, ...createdBy, categoryId, };
    });
  }

  async update (context: GenericContext, id: string, spreadsheetTemplate: UpdateSpreadsheetTemplateDto): Promise<SpreadsheetTemplateResponseDto> {
    const dataFromDB = await this.getSpreadsheetTemplate(id, true, context);
    const createdBy = getCreatedBy(dataFromDB.user, dataFromDB.user);
    const category = await this.getCategory(spreadsheetTemplate.categoryId, context);
    delete spreadsheetTemplate.categoryId;
    const updatedSpreadsheetTemplate = await this.spreadsheetTemplateRepository.updateEntity(id, {
      ...spreadsheetTemplate,
      category,
    });
    return { ...updatedSpreadsheetTemplate, ...createdBy, categoryId: category ? category.id : null, };
  }

  async delete (context: GenericContext, ids: Array<number>): Promise<BaseMessageDto> {
    ids = await this.getFewSpreadsheetTemplateIds(ids, context);
    await this.spreadsheetTemplateRepository.deleteFewEntities(ids);

    return { message: 'SpreadsheetTemplates were successfully deleted', };
  }

  async copyOrDuplicate (context: GenericContext, id: string, isDuplicate: boolean): Promise<BaseMessageDto> {
    const dataFromDB = await this.getSpreadsheetTemplate(id, true, context);
    if (dataFromDB.user.id === context.user.id && isDuplicate ||
      dataFromDB.user.id !== context.user.id && !isDuplicate && dataFromDB.isShared) {
      const dataToDB = {
        name: `${dataFromDB.name} (copy)`,
        description: dataFromDB.description,
        settings: dataFromDB.settings,
        isShared: false,
        user: context.user,
        category: null,
      };
      await this.spreadsheetTemplateRepository.createEntity(dataToDB);

      return { message: `SpreadsheetTemplate was successfully ${isDuplicate ? 'duplicated' : 'copied'}`, };
    }
    throw new BadRequestException(`Unable to ${isDuplicate ? 'duplicate' : 'copy'} this template`);

  }

  async shareOrUnshare (context: GenericContext, ids: Array<number>, isShare: boolean): Promise<BaseMessageDto> {
    ids = await this.getFewSpreadsheetTemplateIds(ids, context);
    await this.spreadsheetTemplateRepository.updateFewEntities(ids, { isShared: isShare, });

    return { message: `SpreadsheetTemplates were successfully ${isShare ? 'shared' : 'unshared'}`, };
  }

  async getSpreadsheetTemplate (id: number | string, includingShared: boolean, context: GenericContext): Promise<SpreadsheetTemplate> {
    const template = await this.spreadsheetTemplateRepository.readEntityById(id, { relations: [ 'user', 'category', ], });

    if (template) {
      if (includingShared && template.isShared) {
        const organizationId = await this.userService.getUserOrganizationId(template.user.id);
        checkOrganizationContext(organizationId, context, this.logger);
      } else {
        checkUserContext(template.user.id, context, this.logger);
      }
      return template;
    }
    throw new NotFoundException('SpreadsheetTemplate not found');

  }

  private async getFewSpreadsheetTemplateIds (ids: Array<number>, context: GenericContext): Promise<Array<number>> {
    const templates = await this.spreadsheetTemplateRepository.readFewEntities(ids, { relations: [ 'user', ], });
    ids = templates.map(template => {
      checkUserContext(template.user.id, context, this.logger);
      return template.id;
    });
    if (ids.length === 0) {
      throw new NotFoundException('SpreadsheetTemplate not found');
    }
    return ids;
  }

  private getCategory (id: number | string, context: GenericContext): Promise<SpreadsheetTemplateCategory> | null {
    return id ? this.spreadsheetTemplateCategoriesService.getSpreadsheetTemplateCategory(id, context) : null;
  }
}
