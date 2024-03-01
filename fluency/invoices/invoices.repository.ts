import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Invoice } from './invoices.entity';
import { InvoicesFilter } from './common/types';
import { GetAllInvoicesAdminResponseDTO, GetAllInvoicesUserResponseDTO } from './DTO';
import { OrderByEnum, TransactionsStatusEnum, TransactionsTypeEnum } from '../common/enums';

@EntityRepository(Invoice)
export class InvoicesRepository extends BaseRepository<Invoice> {
  readAllByAdmin(options: InvoicesFilter): Promise<Array<GetAllInvoicesAdminResponseDTO>> {
    const params = [];
    let count = 0;
    let query = `SELECT invoices.id               AS "id",
                    users.full_name               AS "name",
                    users.email,
                    users.phone_number            AS "phone",
                    users.id                      AS "userId",
                    invoices.created_at           AS "createdAt",
                    invoices.status,
                    invoices.comment,
                    COALESCE(invoices.balance, 0) AS "actualRequestBalance",
                    COALESCE(balance.amount / 100, 0)   AS "currentBalance",
                    p.id                          AS "pixId",
                    ba.id                         AS "bankAccountId"
          FROM users
            LEFT JOIN (
                SELECT DISTINCT user_id,
                    MAX(created_at) AS "createdAt"
                FROM invoices i
                WHERE deleted_at IS NULL
                GROUP BY user_id
            ) i ON i.user_id = users.id 
            LEFT JOIN invoices ON users.id = i.user_id AND invoices.created_at = i."createdAt" AND invoices.deleted_at IS NULL

         LEFT JOIN (
            WITH f AS (
                SELECT 
                COALESCE(SUM(CASE WHEN type = '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float AS refill,
                COALESCE(SUM(CASE WHEN type != '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float  AS payOut,
                user_id            AS "userId"
            FROM transactions
            WHERE deleted_at IS NULL
            GROUP BY user_id)

            SELECT to_char((refill - payOut) / 100, 'FM999900000000.00')::float AS amount,
                "userId"
            FROM f) balance ON balance."userId" = users.id
            LEFT JOIN pix p ON users.id = p.user_id AND p.deleted_at IS NULL
            LEFT JOIN bank_accounts ba ON users.id = ba.user_id AND ba.deleted_at IS NULL
            WHERE users.deleted_at IS NULL`;

    if (options.statuses) {
      count ++;
      query += ` AND invoices.status = ANY($${count})`;
      params.push(options?.statuses);
    }
    if (options.search) {
      count ++;
      query += ` AND users.full_name ILIKE $${count}`;
      params.push(`%${options.search}%`);
    }

    query += ' GROUP BY users.id, users.full_name, users.email, users.phone_number, invoices.id, balance.amount, p.id, ba.id';

    if (options.sorting) {
      const firstPart = 'SELECT * FROM (';
      const lastPart = `) AS t ORDER BY ${InvoicesRepository.getOrderBy(options.orderBy)} ${options.sorting}`;
      query = firstPart + query + lastPart;
    }

    return this.query(query, params);
  }

  readAllByUser(userId: number): Promise<Array<GetAllInvoicesUserResponseDTO>> {
    const query = `SELECT invoices.id,
                    invoices.created_at AS "createdAt",
                    invoices.updated_at AS "updatedAt",
                    invoices.deleted_at AS "deletedAt",
                    invoices.status,
                    invoices.comment,
                    COALESCE(invoices.balance / 100, 0) AS "actualRequestBalance",
                    COALESCE(balance.amount, 0)   AS "currentBalance"
            FROM invoices
             LEFT JOIN users u on u.id = invoices.user_id
             LEFT JOIN (
            WITH f AS (
                SELECT 
                COALESCE(SUM(CASE WHEN type = '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float AS refill,
                COALESCE(SUM(CASE WHEN type != '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float  AS payOut,
                user_id            AS "userId"
            FROM transactions
            WHERE deleted_at IS NULL
            GROUP BY user_id)

            SELECT to_char((refill - payOut) / 100, 'FM999900000000.00')::float AS amount,
                "userId"
            FROM f) balance ON balance."userId" = u.id
            WHERE invoices.deleted_at IS NULL AND user_id = $1
            ORDER BY invoices.created_at  ASC`;
    return this.query(query, [ userId, ]);
  }

  readByAdmin(id: number): Promise<Array<GetAllInvoicesAdminResponseDTO>> {
    const query = `SELECT invoices.id,
                    invoices.created_at AS "createdAt",
                    invoices.updated_at AS "updatedAt",
                    invoices.deleted_at AS "deletedAt",
                    invoices.status,
                    invoices.comment,
                    u.id                AS "userId",
                    u.full_name         AS "name",
                    u.email,
                    u.phone_number       AS "phone",
                    balance.amount / 100      AS balance

            FROM invoices
    
            INNER JOIN users u on u.id = invoices.user_id
            LEFT JOIN (
            WITH f AS (
                    SELECT COALESCE(SUM(CASE WHEN type = '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float AS refill,
                           COALESCE(SUM(CASE WHEN type != '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float  AS payOut,
                    user_id AS "userId"
                    from transactions
                    WHERE deleted_at IS NULL
                group by user_id)

                    SELECT to_char((refill  - payOut) / 100, 'FM99990.00')::float AS amount,
                           "userId"
            from f) balance ON balance."userId" = u.id
            WHERE invoices.deleted_at IS NULL AND invoices.id = $1 `;

    return this.query(query, [ id, ]);
  }

  private static getOrderBy(orderBy: OrderByEnum): string {
    const orderByVariants = {
      [OrderByEnum.CREATED]: 't."createdAt"',
      [OrderByEnum.ALPHABET]: 't."name"',
    };
    return orderByVariants[orderBy];
  }
}
