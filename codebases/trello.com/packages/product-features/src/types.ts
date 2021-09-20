/* eslint-disable @trello/disallow-filenames */
// eslint-disable-next-line no-restricted-imports
import { PremiumFeatures as PremiumFeaturesFromGraphQLSchema } from '@trello/graphql/generated';
import { ProductId } from './products/ids';

export const ProductFamily = {
  Gold: 'GOLD',
  Standard: 'STANDARD',
  BusinessClass: 'BUSINESS_CLASS',
  Enterprise: 'ENTERPRISE',
} as const;

export type ProductFamily = typeof ProductFamily[keyof typeof ProductFamily];

export const ProductName = {
  BusinessClass: 'Business Class',
  BusinessClass2PO: 'Business Class v2 PO',
  BusinessClass3PO: 'Business Class v3 PO',
  BusinessClass3x1PO: 'Business Class v3.1 PO',
  BusinessClass3x3PO: 'Business Class v3.3 PO',
  Enterprise: 'Enterprise',
  Enterprise1x1: 'Enterprise v1.1',
  Enterprise1x2: 'Enterprise v1.2',
  Enterprise2x0: 'Enterprise v2.0',
  Enterprise2x1: 'Enterprise v2.1',
  Standard: 'Standard',
  TrelloGoldFromBC: 'Trello Gold from BC',
  TrelloGoldMonthly: 'Trello Gold',
  TrelloGoldYearly: 'Trello Gold',
} as const;

export type ProductName = typeof ProductName[keyof typeof ProductName];

export const ProductShortName = {
  BusinessClassMonthly: 'businessClassMonthly',
  BusinessClassYearly: 'businessClassYearly',
  BusinessClass3Monthly: 'businessClass3Monthly',
  BusinessClass3Yearly: 'businessClass3Yearly',
  BusinessClass2PO: 'businessClass2PO',
  BusinessClass3PO: 'businessClass3PO',
  BusinessClass3x1Monthly: 'businessClass3x1Monthly',
  BusinessClass3x1Yearly: 'businessClass3x1Yearly',
  BusinessClass3x2Monthly: 'businessClass3x2Monthly',
  BusinessClass3x2Yearly: 'businessClass3x2Yearly',
  BusinessClass3x3Monthly: 'businessClass3x3Monthly',
  BusinessClass3x3Yearly: 'businessClass3x3Yearly',
  BusinessClass3x1PO: 'businessClass3x1PO',
  BusinessClass3x3PO: 'businessClass3x3PO',
  Enterprise: 'enterprise',
  Enterprise1x1TieredPricing: 'enterprise1x1TieredPricing',
  Enterprise1x2SiteLicense: 'enterprise1x2SiteLicense',
  Enterprise2x0TieredPricing: 'enterprise2x0TieredPricing',
  Enterprise2x1SiteLicense: 'enterprise2x1SiteLicense',
  StandardMonthly: 'standardMonthly',
  StandardYearly: 'standardYearly',
  StandardMonthly2: 'standardMonthly2',
  StandardYearly2: 'standardYearly2',
  TrelloGoldFromBC: 'trelloGoldFromBC',
  TrelloGoldMonthly: 'trelloGoldMonthly',
  TrelloGoldYearly: 'trelloGoldYearly',
} as const;

export type ProductShortName = typeof ProductShortName[keyof typeof ProductShortName];

export const ProductInterval = {
  Monthly: 'monthly',
  Yearly: 'yearly',
} as const;

export type ProductInterval = typeof ProductInterval[keyof typeof ProductInterval];

export const PremiumFeature = {
  ...PremiumFeaturesFromGraphQLSchema,

  // Added for case-sensitivity with legacy code
  EnterpriseUI: PremiumFeaturesFromGraphQLSchema.EnterpriseUi,

  // The following are NOT returned by server, but are hard-coded here in web to
  // enable/disable features on certain legacy pages. It's not obvious
  // which of these are used. This should NOT be appended to, and is only here for
  // legacy code support. New features should be added to the GraphQL schema
  // as the source of truth
  Logo: 'logo', // Custom org logo
  OrgCards: 'orgCards', // Org users can see all visible members cards in the org
  OrgMembersPage: 'orgMembersPage', // Admins can use the org members page
  Prefs: 'prefs', // Not an actual feature, just marks the ability to use the preferences menu
  ToBeUpgradedToMBGPlan: 'toBeUpgradedToMBGPlan', // Organizations not yet enabled within multi-board guest feature
} as const;

export type PremiumFeature = typeof PremiumFeature[keyof typeof PremiumFeature];
export interface Product {
  id: ProductId;
  family: ProductFamily;
  shortName: ProductShortName;
  name: ProductName;
  interval?: ProductInterval;
  features: Set<PremiumFeature>;
  hidden?: boolean;
  current: boolean;
  smartBill: boolean;
  perUser: boolean;
  prebill: boolean;
  purchaseOrder?: boolean;
  upgrade?: boolean;
  yearlyEquivalent?: ProductId;
  bcUpgradeProduct?: ProductId; // used for upgrading Standard to BC
  updateProduct?: ProductId; // used for updating sunsetted product

  /**
   * @deprecated
   */
  price?: number;
}

export type ProductDesc = ProductId | ProductShortName | string | number;

export interface BillingDates {
  [productCode: number]: string;
}

export interface ExpirationDates {
  [productCode: number]: string;
}
