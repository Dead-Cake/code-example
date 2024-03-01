import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { Pix } from './pix.entity';
import { PixResponseDTO } from './DTO';

@EntityRepository(Pix)
export class PixRepository extends BaseRepository<Pix> {

  readPix(userId: number): Promise<Array<PixResponseDTO>> {
    const query = `SELECT pix.id,
            pix.created_at AS "createdAt",
            pix.updated_at AS "updatedAt",
            pix.deleted_at AS "deletedAt",
            pix.cpf,
            pix.email,
            pix.phone,
            pix.cnpj,
            pix.key,
            ba.agency,
            ba.city,
            ba.state_id    AS "stateId",
            ba.country_id   AS "countryId",
            ba.bank_id     AS "bankId",
            ba.account_number AS "accountNumber"
    FROM pix
    LEFT JOIN bank_accounts ba ON ba.id = pix.bank_account_id
    WHERE pix.deleted_at IS NULL and pix.user_id = $1`;
    return this.query(query, [ userId, ]);
  }

  readPixById(id: number): Promise<Array<PixResponseDTO>> {
    const query = `SELECT pix.id,
            pix.created_at AS "createdAt",
            pix.updated_at AS "updatedAt",
            pix.deleted_at AS "deletedAt",
            pix.cpf,
            pix.email,
            pix.phone,
            pix.cnpj,
            pix.key,
            ba.agency,
            ba.city,
            ba.state_id    AS "stateId",
            ba.bank_id     AS "bankId",
            ba.country_id   AS "countryId",
            ba.account_number AS "accountNumber"
    FROM pix
    LEFT JOIN bank_accounts ba ON ba.id = pix.bank_account_id
    WHERE pix.deleted_at IS NULL and pix.id = $1`;
    return this.query(query, [ id, ]);
  }
}
