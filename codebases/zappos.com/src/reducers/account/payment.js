import {
  RECEIVE_PAYMENT_INFO,
  RECEIVE_PAYMENT_INFO_BY_ID,
  RECEIVE_UPDATE_PAYMENT_INFO_ERROR,
  REQUEST_PAYMENT_INFO,
  RESET_SAVED_PAYMENT_INFO,
  SET_ERROR,
  UPDATE_PAYMENT_BILLING_ADDRESS,
  UPDATE_PAYMENT_CARD_NUMBER,
  UPDATE_PAYMENT_EXPIRATION_MONTH,
  UPDATE_PAYMENT_EXPIRATION_YEAR,
  UPDATE_PAYMENT_FULL_NAME
} from 'constants/reduxActions';

const initialState = {
  paymentInstruments: null,
  paymentInstrumentId: '',
  addressId: '',
  fullName: '',
  addCreditCardNumber: '',
  expirationMonth: '01',
  expirationYear: new Date().getFullYear().toString(),
  paymentType: '',
  primaryPaymentMethod: false,
  isLoading: false,
  isFormValid: false,
  updatePaymentError: null
};

const validate = state => {
  const { addressId, addCreditCardNumber, fullName } = state;
  const isFormValid = Boolean(fullName && addCreditCardNumber && addressId);
  return { ...state, isFormValid };
};

export default function paymentInfo(state = initialState, action) {
  const {
    type,
    addressId,
    paymentInstrument,
    paymentInstruments,
    fullName,
    addCreditCardNumber,
    expirationMonth,
    expirationYear,
    error
  } = action;

  switch (type) {
    case REQUEST_PAYMENT_INFO:
      return { ...state, isLoading: true };
    case RECEIVE_PAYMENT_INFO:
      return { ...state, paymentInstruments, isLoading: false };
    case RECEIVE_PAYMENT_INFO_BY_ID:
      return {
        ...state,
        addressId: paymentInstrument.billingAddress ? paymentInstrument.billingAddress.addressId : null,
        fullName: paymentInstrument.fullName,
        addCreditCardNumber: paymentInstrument.addCreditCardNumber,
        expirationMonth: paymentInstrument.expirationMonth,
        expirationYear: paymentInstrument.expirationYear,
        paymentType: paymentInstrument.paymentType,
        paymentInstrumentId: paymentInstrument.paymentInstrumentId,
        primaryPaymentMethod: paymentInstrument.primaryPaymentMethod,
        isLoading: false
      };
    case UPDATE_PAYMENT_FULL_NAME:
      return validate({ ...state, fullName });
    case UPDATE_PAYMENT_CARD_NUMBER:
      return validate({ ...state, addCreditCardNumber });
    case UPDATE_PAYMENT_EXPIRATION_MONTH:
      return validate({ ...state, expirationMonth });
    case UPDATE_PAYMENT_EXPIRATION_YEAR:
      return validate({ ...state, expirationYear });
    case UPDATE_PAYMENT_BILLING_ADDRESS:
      return validate({ ...state, addressId });
    case SET_ERROR:
      return { ...state, isLoading: false };
    case RESET_SAVED_PAYMENT_INFO:
      return {
        ...initialState,
        paymentInstruments: state.paymentInstruments
      };
    case RECEIVE_UPDATE_PAYMENT_INFO_ERROR:
      return {
        ...state,
        isLoading: false,
        updatePaymentError: error
      };
    default:
      return state;
  }
}
