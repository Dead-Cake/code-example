import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Sale } from './sale.entity';
import { DateUnitEnum, SalesStatusEnum } from '../common/enums';
import { IDateRange } from '../common/utilities/interface';
import {
  GetAllAdminQueryDTO,
  GetAllByAdminResponseDTO,
  SaleHistoryItemDTO,
  SaleResponseDTO,
  SortingSalesOptionsDTO
} from './DTO';
import { User } from '../users/user.entity';
import { ManyUsersSales, NumberOfSales } from './common/types';
import { SalesOrderByEnum } from './common/enums';

@EntityRepository(Sale)
export class SaleRepository extends BaseRepository<Sale> {
  getSaleHistory(startDate: Date, endDate: Date, userId: number): Promise<Array<SaleHistoryItemDTO>> {
    const query = `SELECT series_date      AS date,
                          count(s.id)::int AS "numberOfSales"
                   FROM generate_series(date_trunc('day', $1::timestamp AT TIME ZONE 'utc') + interval '12h',
                       date_trunc('day', $2::timestamp AT TIME ZONE 'utc') + interval '12h', '1 day') AS series_date
                   LEFT JOIN (SELECT DISTINCT ON (sales.hotmart_transaction_code) sales.id,
                                                                  sales.user_id,
                                                                  sales.status,
                                                                  sales.created_at,
                                                                  sales.deleted_at,
                                                                  sales.hotmart_transaction_code
                   FROM sales
                   WHERE sales.user_id = $3 AND sales.status != '${SalesStatusEnum.REFUNDED}') s
                   ON date_trunc('day', series_date) = date_trunc('day', s.created_at) AND deleted_at IS NULL
GROUP BY series_date
ORDER BY series_date`;
    return this.query(query, [ startDate, endDate, userId, ]);
  }

  getNumberOfSales(date: IDateRange, stepUnit: DateUnitEnum, dateFormat: string): Promise<Array<{ numberOfSales: number }>> {
    const params: Array<string | Date | number> = [ date.startDate, date.endDate, dateFormat, ];
    const query = `SELECT COALESCE(count(s.id), 0)::int AS "numberOfSales"
                   FROM generate_series($1 ::timestamp , $2 ::timestamp , '1 ${stepUnit}'::interval) "days"
               LEFT JOIN (SELECT DISTINCT ON (hotmart_transaction_code) id, user_id, status, created_at, deleted_at, hotmart_transaction_code FROM sales) s 
               ON to_char(created_at, $3) = to_char("days",$3) AND status != '${SalesStatusEnum.REFUNDED}' AND deleted_at IS NULL
               GROUP BY "days" ORDER BY "days"`;

    return this.query(query, params);
  }

  getUsersSalesByWeek(userIds: Array<number>): Promise<Array<ManyUsersSales>> {
    const query = `SELECT u.id                                                                   AS "id",
       ((EXTRACT(day FROM (DATE_TRUNC('week', NOW()) - s.created_at)) / 7)::int + 1)::int        AS "weeksAgo",
       (COUNT((EXTRACT(day FROM (DATE_TRUNC('week', NOW()) - s.created_at)) / 7)::int + 1))::int AS "numberOfSales"

         FROM users u
         LEFT JOIN group_users ad ON ad.user_id = u.id AND ad.role = 'Admin'  AND ad.deleted_at IS NULL
         LEFT JOIN group_users gu ON (gu.group_id = ad.group_id OR gu.user_id = u.id AND gu.status = 'Accepted') AND gu.deleted_at IS NULL
         LEFT JOIN (SELECT DISTINCT ON (sales.hotmart_transaction_code) sales.id,
                                                  sales.user_id,
                                                  sales.status,
                                                  sales.created_at,
                                                  sales.deleted_at,
                                                  sales.hotmart_transaction_code
                    FROM sales
                    WHERE sales.deleted_at IS NULL AND sales.status != '${SalesStatusEnum.REFUNDED}') s
                    ON s.user_id = u.id AND  (s.user_id = gu.user_id AND (s.created_at >= gu.created_at OR gu.role = 'Admin') AND ad.id IS NOT NULL
                                 OR s.user_id = u.id AND ad.id IS NULL OR gu.id IS NULL AND ad.id IS NULL)
         WHERE u.deleted_at IS NULL AND u.id = ANY($1)
         GROUP BY u.id, "weeksAgo"`;
    return this.query(query, [ userIds, ]);
  }

  async getSalesSummary(groupId: number, startDate?: Date): Promise<number> {
    const params: [ number, Date?, ] = [ groupId, ];
    let query = `SELECT COALESCE(count(sc.id), 0)::int
                    FROM sales s
                    LEFT JOIN group_users gu ON gu.user_id = s.user_id
                        AND gu.status = 'Accepted' AND gu.deleted_at IS NULL
                    LEFT JOIN (SELECT DISTINCT ON (hotmart_transaction_code) id,
                                created_at AS "createdAt"
                                FROM sales) sc ON sc.id = s.id
                    WHERE s.status != '${SalesStatusEnum.REFUNDED}'  AND s.deleted_at IS NULL AND gu.group_id = $1`;
    if (startDate) {
      params.push(startDate);
      query += ' AND sc."createdAt" >= $2';
    }
    const [ result, ] = await this.query(query, params);
    return result.count;
  }

  readAll(userId: number, sortingOptions: SortingSalesOptionsDTO): Promise<Array<SaleResponseDTO>> {
    const query = `SELECT DISTINCT ON (${SaleRepository.getOrderBy(sortingOptions.orderBy)}, sales."id")
                      sales.id,
                      sales.created_at                AS "createdAt",
                      sales.updated_at                AS "updatedAt",
                      sales.deleted_at                AS "deletedAt",
                      sales.hotmart_transaction_code  AS "hotmartTransactionCode",
                      sales.created_at                AS "purchaseDate",
                      sales.product_name              AS "productName",
                      sales.price::float / 100        AS "price",
                      sales.client_name               AS "clientName",
                      sales.status,
                      CASE WHEN sales.status = '${SalesStatusEnum.REFUNDED}' THEN 0 ELSE t.amount::float / 100 END          AS "commission",
                      sales.warranty_date             AS "warrantyDate",
                      sales.payment_type              AS "paymentType"
                  FROM sales
                  LEFT JOIN transactions t ON t.sale_id = sales.id AND t.is_leader = false
                  WHERE sales.user_id = $1 AND sales.deleted_at IS NULL
                  ORDER BY ${SaleRepository.getOrderBy(sortingOptions.orderBy)} ${sortingOptions.sorting}`;
    return this.query(query, [ userId, ]);
  }

  readAllByAdmin(options: GetAllAdminQueryDTO): Promise<Array<GetAllByAdminResponseDTO>> {
    const query = `SELECT DISTINCT ON (${SaleRepository.getOrderBy(options.orderBy)}, sales."id")
                      sales.id,
                      sales.created_at                AS "createdAt",
                      sales.updated_at                AS "updatedAt",
                      sales.deleted_at                AS "deletedAt",
                      sales.hotmart_transaction_code  AS "hotmartTransactionCode",
                      sales.created_at                AS "purchaseDate",
                      sales.product_name              AS "productName",
                      sales.price::float / 100        AS "price",
                      sales.client_name               AS "clientName",
                      sales.status,
                      CASE WHEN sales.status = '${SalesStatusEnum.REFUNDED}' THEN 0 ELSE t.amount::float / 100 END          AS "commission",
                      sales.warranty_date             AS "warrantyDate",
                      sales.payment_type              AS "paymentType",
                      users.full_name                 AS "userName"
                  FROM sales
                  LEFT JOIN users ON users.id = sales.user_id 
                  LEFT JOIN transactions t ON t.sale_id = sales.id AND t.is_leader = false
                  WHERE (sales.created_at  BETWEEN $1 AND $2) AND sales.deleted_at IS NULL AND users.full_name ILIKE $3
                  ORDER BY ${SaleRepository.getOrderBy(options.orderBy)} ${options.sorting}`;
    return this.query(query, [ options.startDate, options.endDate, `%${options.search ?? ''}%`, ]);
  }

  readNumberOfSales(user?: User, date?: Date): Promise<Array<NumberOfSales>> {
    const options = [];
    let count = 1;
    let query = `SELECT count(t.hotmart_transaction_code):: int AS "salesNumber"
       FROM (SELECT DISTINCT ON (sales.hotmart_transaction_code) sales.hotmart_transaction_code,
                      sales.created_at AS "createdAt"
                      FROM sales       
                   WHERE sales.status  != '${SalesStatusEnum.REFUNDED}' AND sales.deleted_at IS NULL `;
    if (user) {
      query += ` AND sales.user_id = $${count}`;
      options.push(user.id);
      count++;
    }
    if (date) {
      query += ` AND sales.created_at >= $${count}`;
      options.push(date);
    }
    query += '  ) t';
    return this.query(query, options);
  }

  private static getOrderBy(orderBy: SalesOrderByEnum): string {
    const orderByVariants = {
      [SalesOrderByEnum.PRICE]: 'sales."price"',
      [SalesOrderByEnum.PURCHASE_DATE]: 'sales.created_at',
      [SalesOrderByEnum.WARRANTY_DATE]: 'sales.warranty_date',
    };
    return orderByVariants[orderBy];
  }
}
