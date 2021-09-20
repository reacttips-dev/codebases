// Statuses
// We are not yet explicitly  handling:
// new, pre_sale, paused, unknown, void, graduated, invalidated, expired, void
export const ACTIVE = 'active';
export const PREORDER = 'pre_order';
export const CANCELING = 'canceling';
export const CANCELED = 'canceled';
export const PAST_DUE = 'past_due';
export const FAILED = 'failed';
export const PAID = 'paid';
export const DUE = 'due'; // for next payment in billing history
export const CA_OVER_LIMIT = 'hit_california_94874_limit';
export const TRIALING = 'trialing';

// Order types
export const FLEX_SUBSCRIPTION = 'flex_subscription';
export const UPFRONT_RECURRING = 'upfront_recurring';
export const RECURRING = 'recurring';

export const MONTHLY_TYPES = [UPFRONT_RECURRING, RECURRING];
// Misc
export const CANCELABLE_STATUSES = [PREORDER, ACTIVE, PAST_DUE, TRIALING];
export const FILTERABLE_PAYMENT_STATUSES = ['invalidated'];
export const SHOW_PAYMENT_METHOD_STATUSES = [
    PREORDER,
    ACTIVE,
    CANCELING,
    PAST_DUE,
    TRIALING,
]; // Only display the payment method for subscriptions with this status.