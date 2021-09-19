import { PAYMENT_FIELDS } from 'constants/formFields';
import {
  CLEAR_PAYMENT_FORM_ERRORS,
  CLEAR_PAYMENT_FORM_ITEM,
  GET_PAYMENTS_SUCCESS,
  SET_HAS_VERIFY_CC_ERROR,
  SET_PAYMENT_DATA_LOADING,
  SET_PAYMENT_FORM_ITEM
} from 'store/ducks/payment/types';
import {
  CONFIGURE_CHECKOUT_SUCCESS
} from 'store/ducks/checkout/types';
import { SET_FORM_ERRORS } from 'store/ducks/types';

const defaultState = {
  formItem: {},
  isLoading: false,
  isLoaded: false,
  savedPayments: []
};

export default function paymentReducer(state = defaultState, action = {}) {
  const {
    type,
    hasVerifyCreditCardError,
    payload
  } = action;

  switch (type) {
    case CONFIGURE_CHECKOUT_SUCCESS: {
      const { paymentOptions } = payload;

      if (paymentOptions) {
        const { paymentInstruments: savedPayments } = paymentOptions;
        return { ...state, savedPayments, isLoaded: true };
      }

      return state;
    }
    case GET_PAYMENTS_SUCCESS: {
      const { paymentInstruments: savedPayments } = payload;
      return { ...state, savedPayments, isLoaded: true, isLoading: false };
    }

    case SET_HAS_VERIFY_CC_ERROR: {
      return { ...state, hasVerifyCreditCardError, isLoading: false };
    }

    case SET_PAYMENT_DATA_LOADING: {
      return { ...state, isLoading: payload };
    }

    case SET_PAYMENT_FORM_ITEM: {
      return { ...state, formItem: payload };
    }

    case CLEAR_PAYMENT_FORM_ITEM: {
      return { ...state, formItem: {}, isLoading: false };
    }

    case SET_FORM_ERRORS: {
      const formErrors = {};
      payload.forEach(error => {
        const key = requestFieldToFormField[error.fieldName]?.formField.fieldName;
        if (key) {
          const msg = getError(key, error.id);
          formErrors[key] = msg;
        }
      });

      return { ...state, formItem: { ...state.formItem, formErrors } };
    }

    case CLEAR_PAYMENT_FORM_ERRORS: {
      return { ...state, formItem: { ...state.formItem, formErrors: {} } };
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
  'addCreditCardNumber': { form: 'payment', formField: PAYMENT_FIELDS.CC },
  'fullName': { form: 'payment', formField: PAYMENT_FIELDS.NAME_ON_CARD },
  'expirationDate': { form: 'payment', formField: PAYMENT_FIELDS.CC_EXPIRATION_MELODY }
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
    [PAYMENT_FIELDS.CC.fieldName]: 'Please enter a card number.',
    [PAYMENT_FIELDS.CC_EXPIRATION.fieldName]: 'Expiration date is not correct.',
    [PAYMENT_FIELDS.CC_EXPIRATION_MELODY.fieldName]: 'Expiration date is not correct.',
    [PAYMENT_FIELDS.CC_EXPIRATION_MONTH.fieldName]: 'Please enter an expiration month.',
    [PAYMENT_FIELDS.CC_EXPIRATION_YEAR.fieldName]: 'Please enter an expiration year.',
    [PAYMENT_FIELDS.NAME_ON_CARD.fieldName]: 'Please enter cardholder\'s name.'
  }
};
