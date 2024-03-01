import { Expose, Transform } from 'class-transformer';

import { parseDateTime, parsePrice } from '../../common/utilities';
import { parseStringToInt } from '../../common/utilities/parsing.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class HotmartWebhookRequestDTO {
  @Allow()
  @ApiProperty()
  hottok: string;

  @Allow()
  @ApiProperty()
  prod: string;

  @Allow()
  @Expose({ name: 'prod_name', })
  @ApiProperty()
  prodName: string;

  @Allow()
  @ApiProperty()
  off: string;

  @Allow()
  @ApiProperty()
  @Transform(price => parsePrice(price), { toClassOnly: true, })
  price: number;

  @Allow()
  @ApiProperty()
  aff: string;

  @Allow()
  @Expose({ name: 'aff_name', })
  @ApiProperty()
  affName: string;

  @Allow()
  @ApiProperty()
  email: string;

  @Allow()
  @ApiProperty()
  name: string;

  @Allow()
  @Expose({ name: 'first_name', })
  @ApiProperty()
  firstName: string;

  @Allow()
  @Expose({ name: 'last_name', })
  @ApiProperty()
  lastName: string;

  @Allow()
  @ApiProperty()
  doc: string;

  @Allow()
  @Expose({ name: 'phone_local_code', })
  @ApiProperty()
  phoneLocalCode: string;

  @Allow()
  @Expose({ name: 'phone_number', })
  @ApiProperty()
  phoneNumber: string;

  @Allow()
  @Expose({ name: 'phone_checkout_local_code', })
  @ApiProperty()
  phoneCheckoutLocalCode: string;

  @Allow()
  @Expose({ name: 'phone_checkout_number', })
  @ApiProperty()
  phoneCheckoutNumber: string;

  @Allow()
  @ApiProperty()
  address: string;

  @Allow()
  @Expose({ name: 'address_number', })
  @ApiProperty()
  addressNumber: string;

  @Allow()
  @Expose({ name: 'address_country', })
  @ApiProperty()
  addressCountry: string;

  @Allow()
  @Expose({ name: 'address_district', })
  @ApiProperty()
  addressDistrict: string;

  @Allow()
  @Expose({ name: 'address_comp', })
  @ApiProperty()
  addressComp: string;

  @Allow()
  @Expose({ name: 'address_city', })
  @ApiProperty()
  addressCity: string;

  @Allow()
  @Expose({ name: 'address_state', })
  @ApiProperty()
  addressState: string;

  @Allow()
  @Expose({ name: 'address_zip_code', })
  @ApiProperty()
  addressZipCode: string;

  @Allow()
  @IsNotEmpty()
  @ApiProperty()
  transaction: string;

  @Allow()
  @ApiProperty()
  xcod: string;

  @Allow()
  @ApiProperty()
  src: string;

  @Allow()
  @ApiProperty()
  status: string;

  @Allow()
  @Expose({ name: 'payment_type', })
  @ApiProperty()
  paymentType: string;

  @Allow()
  @Expose({ name: 'payment_engine', })
  @ApiProperty()
  paymentEngine: string;

  @Allow()
  @ApiProperty()
  hotkey: string;

  @Allow()
  @Expose({ name: 'name_subscription_plan', })
  @ApiProperty()
  nameSubscriptionPlan: string;

  @Allow()
  @Expose({ name: 'subscriber_code', })
  @ApiProperty()
  subscriberCode: string;

  @Allow()
  @Transform(num => parseStringToInt(num), { toClassOnly: true, })
  @Expose({ name: 'recurrency_period', })
  @ApiProperty()
  recurrencyPeriod: number;

  @Allow()
  @Transform(num => parseStringToInt(num), { toClassOnly: true, })
  @IsInt()
  @IsPositive()
  @IsNumber()
  @ApiProperty()
  recurrency: number;

  @Allow()
  @Expose({ name: 'cms_marketplace', })
  @ApiProperty()
  cmsMarketplace: string;

  @Allow()
  @Expose({ name: 'cms_vendor', })
  @ApiProperty()
  cmsVendor: string;

  @Allow()
  @Expose({ name: 'cms_aff', })
  @ApiProperty()
  cmsAff: string;

  @Allow()
  @Expose({ name: 'coupon_code', })
  @ApiProperty()
  couponCode: string;

  @Allow()
  @Expose({ name: 'callback_type', })
  @ApiProperty()
  callbackType: string;

  @Allow()
  @Expose({ name: 'subscription_status', })
  @ApiProperty()
  subscriptionStatus: string;

  @Allow()
  @Expose({ name: 'transaction_ext', })
  @ApiProperty()
  transactionExt: string;

  @Allow()
  @ApiProperty()
  sck: string;

  @Allow()
  @Expose({ name: 'purchase_date', })
  @ApiProperty()
  purchaseDate: string;

  @Allow()
  @Expose({ name: 'confirmation_purchase_date', })
  @ApiProperty()
  confirmationPurchaseDate: string;

  @Allow()
  @Expose({ name: 'billet_url', })
  @ApiProperty()
  billetUrl: string;

  @Allow()
  @Expose({ name: 'currency_code_from', })
  @ApiProperty()
  currencyCodeFrom: string;

  @Allow()
  @Expose({ name: 'currency_code_from_', })
  @ApiProperty()
  currencyCodeFromOrigin: string;

  @Allow()
  @Expose({ name: 'original_offer_price', })
  @ApiProperty()
  originalOfferPrice: string;

  @Allow()
  @ApiProperty()
  currency: string;

  @Allow()
  @Expose({ name: 'signature_status', })
  @ApiProperty()
  signatureStatus: string;

  @Allow()
  @Expose({ name: 'billet_barcode', })
  @ApiProperty()
  billetBarcode: string;

  @Allow()
  @Expose({ name: 'producer_name', })
  @ApiProperty()
  producerName: string;

  @Allow()
  @Expose({ name: 'producer_document', })
  @ApiProperty()
  producerDocument: string;

  @Allow()
  @Expose({ name: 'producer_legal_nature', })
  @ApiProperty()
  producerLegalNature: string;

  @Allow()
  @Expose({ name: 'currency_code_from_date', })
  @ApiProperty()
  currencyCodeFromDate: string;

  @Allow()
  @Expose({ name: 'refusal_reason', })
  @ApiProperty()
  refusalReason: string;

  @Allow()
  @Expose({ name: 'doc_type', })
  @ApiProperty()
  docType: string;

  @Allow()
  @Expose({ name: 'full_price', })
  @ApiProperty()
  fullPrice: string;

  @Allow()
  @Transform(date => parseDateTime(date), { toClassOnly: true, })
  @Expose({ name: 'warranty_date', })
  @ApiProperty()
  warrantyDate: Date;

  @Allow()
  @Expose({ name: 'cms_aff_currency', })
  @ApiProperty()
  cmsAffCurrency: string;

  @Allow()
  @Expose({ name: 'product_support_email', })
  @ApiProperty()
  productSupportEmail: string;

  @Allow()
  @ApiProperty()
  amount: string;

  @Allow()
  @Expose({ name: 'aff_cms_rate_currency', })
  @ApiProperty()
  affCmsRateCurrency: string;

  @Allow()
  @Expose({ name: 'aff_cms_rate_conversion', })
  @ApiProperty()
  affCmsRateConversion: string;

  @Allow()
  @Expose({ name: 'installments_number', })
  @ApiProperty()
  installmentsNumber: string;

  @Allow()
  @Expose({ name: 'has_co_production', })
  @ApiProperty()
  hasCoProduction: string;

  @Allow()
  @ApiProperty()
  productOfferPaymentMode: string;

  @Allow()
  @Expose({ name: 'receiver_type', })
  @ApiProperty()
  receiverType: string;

  @Allow()
  @Expose({ name: 'subscription_date_next_charge', })
  @ApiProperty()
  subscriptionDateNextCharge: string;

  @Allow()
  @ApiProperty()
  funnel: string;

  @Allow()
  @Expose({ name: 'order_bump', })
  @ApiProperty()
  orderBump: string;

  @Allow()
  @Expose({ name: 'parent_purchase_transaction', })
  @ApiProperty()
  parentPurchaseTransaction: string;

  @Allow()
  @Expose({ name: 'address_country_ISO', })
  @ApiProperty()
  addressCountryIso: string;

  @Allow()
  @Expose({ name: 'business_model', })
  @ApiProperty()
  businessModel: string;
}
