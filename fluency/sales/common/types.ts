import { UserLevelEnum } from '../../common/enums';

 type Identifiable = {
  id: number;
};

export type CreateSales = {
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  clientCountry: string;
  clientState: string;
  clientCity: string;
  clientDistrict: string;
  productName: string;
  productId: string;
  status: string;
  price: number;
  currency: string;
  hotmartTransactionCode: string;
  recurrencyPeriod: number;
  paymentType: string;
  warrantyDate: Date;
};

export type Level = {
  intStars: number;
  starThirds: number;
  level: UserLevelEnum;
  levelTitle: string;
};

export type ManyLevels = Level & Identifiable;

export type NumberOfSales = {
  salesNumber: number;
  createdAt: Date;
};

export type UserLevel = {
  intStars: number;
  starThirds: number;
  level: UserLevelEnum;
  levelTitle: string;
  salesToNextLevel: number;
};

export type ManyUsersLevel = UserLevel & Identifiable;

export type UserSales = {
  numberOfSales: number;
  weeksAgo: number;
};

export type ManyUsersSales = UserSales & Identifiable;
