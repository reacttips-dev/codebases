/**
  ****************************************************************************************
  * My Account Order Statuses
  * V2 = MAFIA
  * V3 = MyAccount
  * Source: ZapposMyAccount/src/com/amazon/zapposmyaccount/viewmodel/OrderViewModel.java
  * Source: ZapposMyAccount/src/com/amazon/zapposmyaccount/viewmodel/LineItemViewModel.java
  * Note: Since MyAccount returns lowercase order status and MAFIA returns it capitalized,
  * it is normalized to lowercase here and in the components via toLowerCase() string method.
  ****************************************************************************************
**/

export const SUBMITTED = 'submitted';
export const DECLINED = 'customer action required';
export const DECLINED_ALT = 'declined';
export const PROCESSING = 'processing';
export const SHIPPED = 'shipped';
export const DELIVERED = 'delivered';
export const DELIVERY_MISTAKE = 'delivery mistake';
export const COMPLETED = 'completed';
export const RETURNING = 'return in progress';
export const RETURNING_ALT = 'returning';
export const RETURNED = 'returned';
export const CANCELLED = 'cancelled';
export const DECLINED_CANCELLED = 'cancelled - card declined';
export const CUSTOMER_ACTION_REQUIRED = 'customer action required'; // mapping required for composite status

// compositeStatus Strings
export const CS_SUBMITTED = 'SUBMITTED';
export const CS_PROCESSING = 'PROCESSING';
export const CS_DECLINED = 'DECLINED';
export const CS_DECLINED_CANCELLED = 'DECLINED_CANCELLED';
export const CS_CANCELLED = 'CANCELLED';
export const CS_COMPLETED = 'COMPLETED';
export const CS_SHIPPED = 'SHIPPED';
export const CS_CUSTOMER_ACTION_REQUIRED = 'CUSTOMER_ACTION_REQUIRED';
export const CS_DELIVERY_MISTAKE = 'DELIVERY_MISTAKE';
export const CS_RETURN_IN_PROGESS = 'RETURN_IN_PROGRESS';
export const CS_RETURNED = 'RETURNED';
export const CS_RETURNING = 'RETURNING';
