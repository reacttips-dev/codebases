import { ADDRESS_MESSAGES } from 'constants/errorMessages';
import {
  RECEIVE_CHANGE_SHIPPING_ADDRESS_ERROR,
  RECEIVE_SHIPPING_INFO,
  RECEIVE_SHIPPING_INFO_BY_ID,
  REQUEST_SHIPPING_INFO,
  RESET_SHIPPING_FORM,
  SET_ERROR,
  UPDATE_MAILING_ADDRESS_OR_NAME,
  UPDATE_SHIPPING_PHONE
} from 'constants/reduxActions';
import { ADDRESS_FIELDS } from 'constants/formFields';
import { VALID_PHONE } from 'common/regex';

const initialState = {
  addresses: null,
  address: {
    phone: {
      voice: {
        primary: {
          number: ''
        }
      }
    },
    name: {
      fullName: ''
    },
    mailingAddress: {
      postalCode: '',
      countryCode: 'US',
      stateOrRegion: '',
      addressLine2: '',
      addressLine1: '',
      city: ''
    },
    isDefaultShippingAddress: false
  },
  isFormValid: false,
  isLoading: false,
  formError: null
};

const validateForm = state => {
  const { address: { name, mailingAddress, phone } } = state;
  const { fullName } = name;
  const { addressLine1, city, stateOrRegion, countryCode } = mailingAddress;
  const { voice: { primary: { number } } } = phone;
  const isFormValid = Boolean(fullName && addressLine1 && city && stateOrRegion && countryCode && number);
  return { ...state, isFormValid };
};

export default function shippingInfo(state = initialState, action) {
  const {
    type,
    address,
    addresses,
    name,
    value,
    error,
    suggestedAddress
  } = action;

  switch (type) {
    case REQUEST_SHIPPING_INFO:
      return { ...state, isLoading: true };
    case RECEIVE_SHIPPING_INFO:
      return { ...state, addresses, isLoading: false };
    case RECEIVE_SHIPPING_INFO_BY_ID:
      return validateForm({ ...state, address, isLoading: false });
    case UPDATE_MAILING_ADDRESS_OR_NAME: {
      if (suggestedAddress) {
        const newAddress = {
          ...state.address,
          mailingAddress: suggestedAddress
        };
        return { ...state, address: newAddress };
      } else {
        const propName = name === 'fullName' ? state.address.name : state.address.mailingAddress;
        const newPropName = { ...propName, [name]: value };
        const newAddress = name === 'fullName' ? { ...state.address, name: newPropName } : {
          ...state.address,
          mailingAddress: newPropName
        };
        const newState = { ...state, address: newAddress };
        return validateForm(validateFormField(newState, name));
      }
    }
    case UPDATE_SHIPPING_PHONE: {
      const newState = {
        ...state,
        address: {
          ...state.address,
          phone: {
            ...state.address.phone,
            voice: {
              primary: {
                number: value
              }
            }
          }
        }
      };
      return validateForm(validateFormField(newState, name));
    }
    case SET_ERROR:
      return { ...state, isLoading: false };
    case RESET_SHIPPING_FORM:
      return {
        ...initialState,
        addresses: state.addresses
      };
    case RECEIVE_CHANGE_SHIPPING_ADDRESS_ERROR:
      return {
        ...state,
        isLoading: false,
        formError: error
      };
    default:
      return state;
  }
}

function validateFormField(state, fieldKey) {
  const { address } = state;
  const { mailingAddress, name, phone: { voice: { primary } } } = address;
  const key = typeof fieldKey === 'string' ? fieldKey : fieldKey.fieldName;
  const returnNewAddr = (key, name, primary, mailingAddress) => {
    switch (key) {
      case ADDRESS_FIELDS.FULL_NAME.fieldName:
        return name;
      case ADDRESS_FIELDS.PHONE_NUMBER.fieldName:
        return primary;
      default:
        return mailingAddress;
    }
  };
  const newAddr = returnNewAddr(key, name, primary, mailingAddress);
  const newError = pushErrorMessages(key, newAddr);

  const addressErrors = mailingAddress && mailingAddress.errors ? mailingAddress.errors : {};
  const newMailingAddress = {
    ...mailingAddress,
    errors: { ...addressErrors, [key]: newError.length ? newError : null }
  };

  // Reset State/Region on Country change
  if (key === ADDRESS_FIELDS.COUNTRY_CODE.fieldName) {
    newMailingAddress.stateOrRegion = '';
  }

  const newAddress = { ...address, mailingAddress: newMailingAddress };

  return { ...state, address: newAddress };
}

export function hasValue(collection, field) {
  return collection.hasOwnProperty(field) && collection[field].trim().length > 0;
}

export function validatePhone(num) {
  return num.match(VALID_PHONE);
}

export function pushErrorMessages(fieldKey, newAddr) {
  const newError = [];

  switch (fieldKey) {
    case ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName:
    {
      const field = ADDRESS_FIELDS.ADDRESS_LINE_1.fieldName;
      if (!hasValue(newAddr, field)) {
        newError.push(ADDRESS_MESSAGES.missing_value[field]);
      }
      break;
    }
    case ADDRESS_FIELDS.ADDRESS_LINE_2.fieldName:
    {
      break;
    }
    case ADDRESS_FIELDS.CITY.fieldName:
    {
      const field = ADDRESS_FIELDS.CITY.fieldName;
      if (!hasValue(newAddr, field)) {
        newError.push(ADDRESS_MESSAGES.missing_value[field]);
      }
      break;
    }
    case ADDRESS_FIELDS.COUNTRY_CODE.fieldName:
    {
      const field = ADDRESS_FIELDS.COUNTRY_CODE.fieldName;
      if (!hasValue(newAddr, field)) {
        newError.push(ADDRESS_MESSAGES.missing_value[field]);
      }
      break;
    }
    case ADDRESS_FIELDS.FULL_NAME.fieldName:
    {
      const field = ADDRESS_FIELDS.FULL_NAME.fieldName;
      if (!hasValue(newAddr, field)) {
        newError.push(ADDRESS_MESSAGES.missing_value[field]);
      }
      break;
    }
    case ADDRESS_FIELDS.PHONE_NUMBER.fieldName:
    {
      const field = newAddr.hasOwnProperty('number') ? 'number' : ADDRESS_FIELDS.PHONE_NUMBER.fieldName;
      if (!hasValue(newAddr, field)) {
        newError.push(ADDRESS_MESSAGES.missing_value[ADDRESS_FIELDS.PHONE_NUMBER.fieldName]);
        break;
      }
      if (!validatePhone(newAddr[field])) {
        newError.push(ADDRESS_MESSAGES.invalid_phone);
        break;
      }
      break;
    }
    case ADDRESS_FIELDS.POSTAL_CODE.fieldName:
    {
      const field = ADDRESS_FIELDS.POSTAL_CODE.fieldName;
      if (!hasValue(newAddr, field)) {
        newError.push(ADDRESS_MESSAGES.missing_value[field]);
      }
      break;
    }
    case ADDRESS_FIELDS.STATE_OR_REGION.fieldName:
    {
      const field = ADDRESS_FIELDS.STATE_OR_REGION.fieldName;
      if (!hasValue(newAddr, field)) {
        const type = '_text';
        newError.push(ADDRESS_MESSAGES.missing_value[field + type]);
      }
      break;
    }
  }
  return newError;
}
