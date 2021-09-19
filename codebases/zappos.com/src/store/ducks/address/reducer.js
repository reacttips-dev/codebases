import { ADDRESS_FIELDS, PAYMENT_FIELDS } from 'constants/formFields';
import {
  ADDRESS_CLEAR_AAC_DATA,
  CLEAR_ADDRESS_FORM_ITEM,
  CLEAR_INVALID_ADDRESS_FIELDS_AND_ERRORS,
  GET_ADDRESSES_SUCCESS,
  ON_TOGGLE_IS_ALSO_BILLING,
  SET_ADDRESS_AUTOCOMPLETE_SUGGESTIONS,
  SET_ADDRESS_DATA_LOADING,
  SET_ADDRESS_FORM_ITEM,
  SET_ADDRESS_LAT_LONG,
  SET_EDIT_OF_INACTIVE_ADDRESS_ERROR,
  SET_INVALID_ADDRESS_FIELDS,
  SET_SUGGESTED_ADDRESSES,
  SET_TEMP_ADDRESS_FAILURE_MSG,
  SET_TEMP_ADDRESS_SUCCESS_MSG
} from 'store/ducks/address/types';
import {
  CONFIGURE_CHECKOUT_SUCCESS
} from 'store/ducks/checkout/types';
import {
  SET_FORM_ERRORS
} from 'store/ducks/types';

const defaultState = {
  formItem: {},
  isLoading: false,
  isLoaded: false,
  savedAddresses: []
};

export default function addressReducer(state = defaultState, action = {}) {
  const {
    isAlsoBilling,
    msg,
    type,
    payload,
    isEditOfInactiveAddressError
  } = action;

  switch (type) {
    case ADDRESS_CLEAR_AAC_DATA: {
      const latLong = '39.8333333,-98.585522'; // fall back to geographic center of the US
      return { ...state, autoCompleteSuggestions: [], latLong };
    }

    case SET_ADDRESS_AUTOCOMPLETE_SUGGESTIONS: {
      if (payload.addresses?.length) {
        return { ...state, autoCompleteSuggestions: payload.addresses };
      }
      return state;
    }

    case SET_ADDRESS_LAT_LONG: {
      if (payload.addresses?.length) {
        const { latitude, longitude } = payload.addresses[0];
        return { ...state, latLong: `${latitude},${longitude}` };
      }

      return state;
    }

    case CONFIGURE_CHECKOUT_SUCCESS: {
      const { allAddresses } = payload;

      if (allAddresses) {
        const { addresses: savedAddresses } = allAddresses;
        return { ...state, savedAddresses, isLoaded: true };
      }

      return state;
    }

    case ON_TOGGLE_IS_ALSO_BILLING: {
      return { ...state, isAlsoBilling };
    }

    case GET_ADDRESSES_SUCCESS: {
      const { addresses } = payload;
      return { ...state, savedAddresses: addresses, isLoaded: true, isLoading: false };
    }

    case SET_TEMP_ADDRESS_FAILURE_MSG: {
      return { ...state, tmpFailureMsg: msg, tmpSuccessMsg: null };
    }

    case SET_TEMP_ADDRESS_SUCCESS_MSG: {
      return { ...state, tmpSuccessMsg: msg, tmpFailureMsg: null };
    }

    case SET_ADDRESS_DATA_LOADING: {
      return { ...state, isLoading: payload };
    }

    case SET_SUGGESTED_ADDRESSES: {
      return { ...state, isLoading: false, formItem: { ...state.formItem, suggestedAddresses: payload } };
    }

    case SET_INVALID_ADDRESS_FIELDS: {
      return { ...state, isLoading: false, formItem: { ...state.formItem, invalidFields: payload, formErrors: {} } };
    }

    case SET_ADDRESS_FORM_ITEM: {
      return { ...state, formItem: payload };
    }

    case CLEAR_ADDRESS_FORM_ITEM: {
      return { ...state, formItem: {}, isLoading: false };
    }

    case SET_FORM_ERRORS: {
      const formErrors = {};
      payload.forEach(error => {
        const key = requestFieldToFormField[error.fieldName].formField.fieldName;
        const msg = getError(key, error.id);
        formErrors[key] = msg;
      });

      return { ...state, formItem: { ...state.formItem, invalidFields: [], formErrors } };
    }

    case CLEAR_INVALID_ADDRESS_FIELDS_AND_ERRORS: {
      return { ...state, formItem: { ...state.formItem, invalidFields: [], formErrors: {}, suggestedAddresses:[] } };
    }

    case SET_EDIT_OF_INACTIVE_ADDRESS_ERROR: {
      return { ...state, isEditOfInactiveAddressError };
    }

    default: {
      return state;
    }
  }
}

export function getError(field, type) {
  if (type === 'required.input.missing') {
    return fieldErrors.missingValue[field] || 'Required';
  }

  if (fieldErrors.hasOwnProperty(type)) {
    return fieldErrors[type];
  }

  return genericErrors[type] || 'Invalid';
}

const requestFieldToFormField = {
  'expirationDate': { form: 'payment', formField: PAYMENT_FIELDS.CC_EXPIRATION_MELODY },
  'addCreditCardNumber': { form: 'payment', formField: PAYMENT_FIELDS.CC },
  'fullName': { form: 'payment', formField: PAYMENT_FIELDS.NAME_ON_CARD },
  'mailingAddress.addressLine1': { form: 'address', formField: ADDRESS_FIELDS.ADDRESS_LINE_1 },
  'mailingAddress.addressLine2': { form: 'address', formField: ADDRESS_FIELDS.ADDRESS_LINE_2 },
  'mailingAddress.city': { form: 'address', formField: ADDRESS_FIELDS.CITY },
  'mailingAddress.countryCode': { form: 'address', formField: ADDRESS_FIELDS.COUNTRY_CODE },
  'mailingAddress.postalCode': { form: 'address', formField: ADDRESS_FIELDS.POSTAL_CODE },
  'mailingAddress.stateOrRegion': { form: 'address', formField: ADDRESS_FIELDS.STATE_OR_REGION },
  'name.fullName': { form: 'address', formField: ADDRESS_FIELDS.FULL_NAME },
  'phone.voice.primary.number': { form: 'address', formField: ADDRESS_FIELDS.PHONE_NUMBER }
};

const genericErrors = {
  'input.invalid': 'Invalid input',
  'required.input.missing': 'Required',
  'validation.exception': 'Invalid Input',
  'max.length.exceeded': 'Input too long'
};

const fieldErrors = {
  invalidPhone: 'Invalid phone number',
  ccExpired: 'Card has expired.',
  ccBadFormat: 'Card number is not correct.',
  ccExpirationBadFormat: 'Expiration date is not correct.',
  missingValue: {
    [ADDRESS_FIELDS.FULL_NAME.fieldName]: 'Please supply a name for this address.',
    [ADDRESS_FIELDS.COUNTRY_CODE.fieldName]: 'Please select a country.',
    [ADDRESS_FIELDS.PHONE_NUMBER.fieldName]: 'Please supply a phone number so we can call if there are any problems using this address.',
    [ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName]: 'At least one address line must be supplied.',
    [ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName]: '',
    [ADDRESS_FIELDS.POSTAL_CODE.fieldName]: 'Please enter a Zip/Postal code.',
    [ADDRESS_FIELDS.STATE_OR_REGION.fieldName]: 'Please enter a state / province or region.',
    [ADDRESS_FIELDS.STATE_OR_REGION.fieldName + '_dropdown']: 'Please enter a state / province or region.',
    [ADDRESS_FIELDS.STATE_OR_REGION.fieldName + '_text']: 'Please enter a state / province or region.',
    [ADDRESS_FIELDS.CITY.fieldName]: 'Please enter a city name for this address.',
    [PAYMENT_FIELDS.CC.fieldName]: 'Please enter a card number.',
    [PAYMENT_FIELDS.CC_EXPIRATION.fieldName]: 'Expiration date is not correct.',
    [PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName]: 'Expiration date is not correct.',
    [PAYMENT_FIELDS.CC_EXPIRATION_MONTH.fieldName]: 'Please enter an expiration month.',
    [PAYMENT_FIELDS.CC_EXPIRATION_YEAR.fieldName]: 'Please enter an expiration year.',
    [PAYMENT_FIELDS.NAME_ON_CARD.fieldName]: 'Please enter cardholder\'s name'
  }
};
