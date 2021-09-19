const exchangesUrl = '/exchange';
export const NEW_ADDRESS_STEP = 14;
export const EDIT_ADDRESS_STEP = 15;
export const LIST_ADDRESS_STEP = 16;
export const REVIEW_STEP = 50;

export const EXCHANGES_STEP_MAP = {
  [EDIT_ADDRESS_STEP]: `${exchangesUrl}/address/edit`,
  [LIST_ADDRESS_STEP]: `${exchangesUrl}/address`,
  [NEW_ADDRESS_STEP]: `${exchangesUrl}/address/new`,
  [REVIEW_STEP]: `${exchangesUrl}`
};
