import {
  OrganizationErrors,
  OrganizationErrorExtensions,
} from './organizations';
import { PaidAccountErrorExtensions } from './paidAccount';
import { PromoCodeErrorExtensions } from './promoCodes';
import { PromotionErrorExtensions } from './promotions';
import { BoardErrors, BoardErrorExtensions } from './boards';

enum UnknownErrorExtensions {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const Errors = {
  ...BoardErrors,
  ...OrganizationErrors,
} as const;

export const ErrorExtensions = {
  ...OrganizationErrorExtensions,
  ...PaidAccountErrorExtensions,
  ...PromoCodeErrorExtensions,
  ...PromotionErrorExtensions,
  ...BoardErrorExtensions,
  ...UnknownErrorExtensions,
} as const;

export type ErrorType = keyof typeof Errors;
export type ErrorExtensionsType = keyof typeof ErrorExtensions;
export {
  OrganizationErrors,
  OrganizationErrorExtensions,
  PaidAccountErrorExtensions,
  BoardErrorExtensions,
};
