import { GetAllInvoicesDTO } from '../DTO';
import { InvoicesStatusEnum, OrderByEnum, Sorting } from '../../common/enums';

export type InvoicesQueryStatuses = Omit<GetAllInvoicesDTO, 'orderBy' | 'search' | 'sorting'>;

export type InvoicesFilter = {
  orderBy: OrderByEnum;
  sorting: Sorting;
  search: string;
  statuses: Array<InvoicesStatusEnum>;
};
