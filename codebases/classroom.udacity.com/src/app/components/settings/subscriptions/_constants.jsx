// Statuses
// We are not yet explicitly  handling:
// new, pre_sale, paused, unknown, void, trialing, graduated, invalidated, expired, paid, void
export const ACTIVE = 'active';
export const PREORDER = 'pre_order';
export const CANCELING = 'canceling';
export const CANCELED = 'canceled';
export const PAST_DUE = 'past_due';
export const FAILED = 'failed';

// Order types
export const FLEX_SUBSCRIPTION = 'flex_subscription';

// Misc
export const CANCELABLE_STATUSES = [PREORDER, ACTIVE, PAST_DUE];
export const FILTERABLE_PAYMENT_STATUSES = ['invalidated'];
export const SHOW_PAYMENT_METHOD_STATUSES = [
  PREORDER,
  ACTIVE,
  CANCELING,
  PAST_DUE,
]; // Only display the payment method for subscriptions with this status.
