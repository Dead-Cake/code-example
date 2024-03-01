import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common';
import { SpreadsheetTemplate } from './spreadsheet-template.entity';
import { GetAllSpreadsheetTemplatesDto } from './DTO';
import { SharedFilter } from '../common/enums/filters';
import { OrderByEnum } from './DTO/order-by.enum';
import { GenericContext } from '../context';

@EntityRepository(SpreadsheetTemplate)
export class SpreadsheetTemplateRepository extends BaseRepository<SpreadsheetTemplate> {
  async readAllSpreadsheetTemplates (context: GenericContext, filterOptions: GetAllSpreadsheetTemplatesDto, siteIds: Array<number>): Promise<Array<SpreadsheetTemplate>> {
    const params = [];
    let count = 0;
    let baseQuery = `SELECT spreadsheet_templates.id, spreadsheet_templates.created_at AS "createdAt", spreadsheet_templates.updated_at
      AS "updatedAt", spreadsheet_templates.deleted_at AS "deletedAt", name, description, settings, is_shared AS "isShared",
      category_id AS "categoryId", users.id AS "userId", users.first_name AS "firstName", users.last_name AS "lastName" 
      FROM spreadsheet_templates INNER JOIN users ON users.id = spreadsheet_templates.user_id INNER JOIN user_sites ON
      users.id = user_sites.user_id WHERE spreadsheet_templates.deleted_at IS NULL `;

    switch (filterOptions.filter) {
      case SharedFilter.ALL:
        baseQuery += ` AND (users.id = ${context.user.id} OR (user_sites.site_id IN (${siteIds}) AND is_shared = true)) `;
        break;
      case SharedFilter.MY:
        baseQuery += ` AND users.id = ${context.user.id} `;
        break;
      case SharedFilter.SHARED:
        baseQuery += ` AND users.id != ${context.user.id} AND user_sites.site_id IN (${siteIds}) AND is_shared = true `;
        break;
    }

    if (filterOptions.search) {
      count += 1;
      baseQuery += ` AND (first_name ILIKE $${count}
      OR last_name ILIKE $${count} OR name ILIKE $${count})`;
      params.push(`%${filterOptions.search.trim()}%`);
    }

    if (filterOptions.categoryId) {
      count += 1;
      baseQuery += ` AND category_id = $${count}`;
      params.push(`${filterOptions.categoryId}`);
    }

    if (filterOptions.sorting) {
      baseQuery += ` ORDER BY ${this.getOrderBy(filterOptions.orderBy)} ${filterOptions.sorting};`;
    }

    const rawData = await this.query(baseQuery, params);

    return rawData.map(spreadsheetTemplate => {
      const { userId, firstName, lastName, categoryId, ...spreadsheet } = spreadsheetTemplate;
      spreadsheet.user = { id: userId, firstName, lastName, };
      spreadsheet.category = { id: categoryId, };
      return spreadsheet;
    });
  }

  private getOrderBy (orderBy: OrderByEnum): string {
    const orderByVariants = {
      [OrderByEnum.TITLE]: 'name',
      [OrderByEnum.DATE_MODIFIED]: 'spreadsheet_templates.updated_at',
    };
    return orderByVariants[orderBy];
  }
}
