import { ADDRESS_FIELDS, PAYMENT_FIELDS } from './formFields';

export const INVALID_ADDRESS = 'invalid-address';

export const REQUEST_ERRORS = {
  'input.invalid': 'Invalid input',
  'required.input.missing': 'Required',
  'validation.exception': 'Invalid Input',
  'max.length.exceeded': 'Input too long'
};

export const ADDRESS_MESSAGES = {
  invalid_phone: 'Invalid phone number',
  missing_value: {
    [ADDRESS_FIELDS.FULL_NAME.fieldName]: 'Please supply a name for this address.',
    [ADDRESS_FIELDS.COUNTRY_CODE.fieldName]: 'Please select a country.',
    [ADDRESS_FIELDS.PHONE_NUMBER.fieldName]: 'Please supply a phone number so we can call if there are any problems using this address.',
    [ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName]: 'At least one address line must be supplied.',
    [ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName]: '',
    [ADDRESS_FIELDS.POSTAL_CODE.fieldName]: 'Please enter a Zip/Postal code.',
    [ADDRESS_FIELDS.STATE_OR_REGION.fieldName]: 'Please enter a state / province or region.',
    [ADDRESS_FIELDS.STATE_OR_REGION.fieldName + '_dropdown']: 'Please enter a state / province or region.',
    [ADDRESS_FIELDS.STATE_OR_REGION.fieldName + '_text']: 'Please enter a state / province or region.',
    [ADDRESS_FIELDS.CITY.fieldName]: 'Please enter a city name for this address.'
  }
};

export const PAYMENT_MESSAGES = {
  cc_expired: 'Card has expired.',
  cc_bad_format: 'Card number is not correct.',
  cc_expiration_bad_format: 'Expiration date is not correct.',
  missing_value: {
    [PAYMENT_FIELDS.CC.fieldName]: 'Please enter a card number.',
    [PAYMENT_FIELDS.CC_EXPIRATION.fieldName]: 'Expiration date is not correct.',
    [PAYMENT_FIELDS.CC_EXPIRATION_MONTH.fieldName]: 'Please enter an expiration month.',
    [PAYMENT_FIELDS.CC_EXPIRATION_YEAR.fieldName]: 'Please enter an expiration year.',
    [PAYMENT_FIELDS.NAME_ON_CARD.fieldName]: 'Please enter cardholder\'s name'
  }
};
