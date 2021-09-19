export const ADDRESS_FIELDS = {
  COUNTRY_CODE: { fieldName: 'countryCode', maxLength: 2, autoComplete: 'country' },
  FULL_NAME: { fieldName: 'fullName', maxLength: 50, autoComplete: 'name' },
  PHONE_NUMBER: { fieldName: 'primaryVoiceNumber', maxLength: 20, type: 'tel', autoComplete: 'tel' },
  ADDRESS_LINE_1: { fieldName: 'addressLine1', maxLength: 60, autoComplete: 'address-line1' },
  ADDRESS_LINE_2: { fieldName: 'addressLine2', maxLength: 60, autoComplete: 'address-line2' },
  POSTAL_CODE: { fieldName: 'postalCode', maxLength: 20, autoComplete: 'postal-code' },
  STATE_OR_REGION: { fieldName: 'stateOrRegion', maxLength: 50, autoComplete: 'address-level1' },
  CITY: { fieldName: 'city', maxLength: 50, autoComplete: 'address-level2' }
};

export const PAYMENT_FIELDS = {
  CC: { fieldName: 'cc', maxLength: 23, autoComplete: 'cc-number' },
  CC_EXPIRATION: { fieldName: 'expiration', maxLength: 7 },
  CC_EXPIRATION_MELODY: { fieldName: 'expirationDate', maxLength: 7 },
  CC_EXPIRATION_MONTH: { fieldName: 'expirationMonth', maxLength: 2, autoComplete: 'cc-exp-month' },
  CC_EXPIRATION_YEAR: { fieldName: 'expirationYear', maxLength: 4, autoComplete: 'cc-exp-year' },
  NAME_ON_CARD: { fieldName: 'name', maxLength: 50, autoComplete: 'cc-name' }
};

export const EMAIL_ADDRESS = {
  maxLength: 100,
  autoComplete: 'email'
};

