import { Products } from './ids';
import { trelloGoldFeatures, trelloGoldFromBCFeatures } from '../features';
import {
  Product,
  ProductInterval,
  ProductName,
  ProductFamily,
  ProductShortName,
} from '../types';

export const memberProducts: Product[] = [
  {
    id: Products.Member.Gold.bc,
    shortName: ProductShortName.TrelloGoldFromBC,
    name: ProductName.TrelloGoldFromBC,
    features: trelloGoldFromBCFeatures,
    family: ProductFamily.Gold,
    prebill: false,
    perUser: false,
    smartBill: false,
    current: false,
  },
  {
    id: Products.Member.Gold.monthly,
    shortName: ProductShortName.TrelloGoldMonthly,
    name: ProductName.TrelloGoldMonthly,
    interval: ProductInterval.Monthly,
    price: 5,
    features: trelloGoldFeatures,
    yearlyEquivalent: 38,
    family: ProductFamily.Gold,
    prebill: true,
    perUser: false,
    smartBill: false,
    current: true,
  },
  {
    id: Products.Member.Gold.yearly,
    shortName: ProductShortName.TrelloGoldYearly,
    name: ProductName.TrelloGoldYearly,
    interval: ProductInterval.Yearly,
    price: 45,
    features: trelloGoldFeatures,
    family: ProductFamily.Gold,
    prebill: true,
    perUser: false,
    smartBill: false,
    current: true,
  },
];
