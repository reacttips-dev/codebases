import marketplace from 'cfg/marketplace.json';

const { checkout: { checkoutUrl } } = marketplace;

export const CART_STEP = -10;
export const TBD_STEP = 1;

export const NEW_ADDRESS_STEP = 14;
export const EDIT_ADDRESS_STEP = 15;
export const LIST_ADDRESS_STEP = 16;

export const PAYMENT_STEP = 22;

export const EDIT_BILLING_ADDRESS_STEP = 26;
export const NEW_BILLING_ADDRESS_STEP = 27;
export const SELECT_BILLING_ADDRESS_STEP = 29;

export const SHIP_OPTIONS_STEP = 30;
export const REVIEW_STEP = 50;
export const UNKNOWN_STEP = 100;

export const CHECKOUT_URL_MAP = {
  [`${checkoutUrl}/address/edit`]: EDIT_ADDRESS_STEP,
  [`${checkoutUrl}/address/new`]: NEW_ADDRESS_STEP,
  [`${checkoutUrl}/address`]: LIST_ADDRESS_STEP,
  [`${checkoutUrl}/billing/edit`]: EDIT_BILLING_ADDRESS_STEP,
  [`${checkoutUrl}/billing/new`]: NEW_BILLING_ADDRESS_STEP,
  [`${checkoutUrl}/billing`]: SELECT_BILLING_ADDRESS_STEP,
  [`${checkoutUrl}/initiate`]: TBD_STEP,
  [`${checkoutUrl}/payment`]: PAYMENT_STEP,
  [`${checkoutUrl}/shipoption`]: SHIP_OPTIONS_STEP,
  [`${checkoutUrl}/spc`]: REVIEW_STEP,
  [checkoutUrl]: TBD_STEP
};

export const CHECKOUT_STEP_MAP = {
  [EDIT_ADDRESS_STEP]: `${checkoutUrl}/address/edit`,
  [EDIT_BILLING_ADDRESS_STEP]: `${checkoutUrl}/billing/edit`,
  [LIST_ADDRESS_STEP]: `${checkoutUrl}/address`,
  [NEW_ADDRESS_STEP]: `${checkoutUrl}/address/new`,
  [NEW_BILLING_ADDRESS_STEP]: `${checkoutUrl}/billing/new`,
  [PAYMENT_STEP]: `${checkoutUrl}/payment`,
  [REVIEW_STEP]: `${checkoutUrl}/spc`,
  [SELECT_BILLING_ADDRESS_STEP]: `${checkoutUrl}/billing`,
  [SHIP_OPTIONS_STEP]: `${checkoutUrl}/shipoption`,
  [TBD_STEP]: checkoutUrl
};
