import {
  CLEAR_VIEWED_ORDER,
  ORDER_CLEAR_SELECTED_ITEMS,
  RECEIVE_ADD_NEW_BILLING_ADDRESS_ERROR,
  RECEIVE_ADD_NEW_PAYMENT_ERROR,
  RECEIVE_ADD_NEW_PAYMENT_SUCCESS,
  RECEIVE_BILLING_ADDRESSES,
  RECEIVE_CONFIRM_CANCELLATION,
  RECEIVE_CONFIRM_CANCELLATION_ERROR,
  RECEIVE_ORDER_DETAILS,
  RECEIVE_SUGGESTED_ADDRESSES,
  RECEIVE_UPDATE_PAYMENT_ERROR,
  RECEIVE_UPDATE_PAYMENT_SUCCESS,
  REQUEST_ADD_NEW_BILLING_ADDRESS,
  REQUEST_ADD_NEW_PAYMENT,
  REQUEST_CONFIRM_CANCELLATION,
  REQUEST_ORDER_DETAILS,
  REQUEST_UPDATE_ASSOCIATED_PAYMENT,
  REQUEST_UPDATE_UNASSOCIATED_PAYMENT,
  SET_IS_ORDER_ITEMS_UPDATING,
  SET_IS_REPETITION_CONFLICT_ERROR,
  SET_IS_SHIPMENT_OPTIONS_ERROR,
  SET_IS_SHIPMENT_OPTIONS_LOADING,
  SET_RETURN_SOURCE_ADDRESS,
  SET_SHIPMENT_OPTIONS,
  TOGGLE_ADD_NEW_BILLING_ADDRESS,
  UPDATE_CANCELLATION_REASON,
  UPDATE_ORDER_WITH_TRACKING_INFO
} from 'constants/reduxActions';
import { injectTrackingToLineItems, injectUniqueIdsToLineItems } from 'helpers/MyAccountUtils';

const initialState = {
  order: null,
  cancellationReasons: [],
  selectedItems: [],
  isLoading: false,
  isPaymentUpdating: false, // @todo consolidate updating flags?
  paymentUpdated: false, // for Order Care: 'Confirm' existing card
  paymentUpdateError: false,
  newPaymentInstrumentId: null, // for Order Care: 'Add new payment'
  isNewPaymentUpdating: false,
  newPaymentError: false,
  newPaymentErrorDetails: null,
  billingAddressesVisible: false, // for Order Care: 'Add new payment', existing billing address
  addresses: null,
  addNewBillingAddressVisible: false, // for Order Care: 'Add new payment', new billing address
  isAddNewBillingAddressUpdating: false,
  addNewBillingAddressError: false,
  addNewBillingAddressErrorDetails: null,
  suggestedAddresses: null,
  newAddressId: null,
  shipmentOptions: [],
  isShipmentOptionsLoading: false,
  isShipmentOptionsError: false,
  isOrderItemsUpdating: false,
  isRepetitionConflictError: false,
  returnSourceAddress: null
};

export default function order(state = initialState, action) {
  const {
    type,
    order,
    cancellationReasonByLineItem,
    newPaymentInstrumentId,
    addresses,
    error,
    visible,
    suggestedAddresses,
    newAddressId,
    trackingInfo,
    shipmentOptions,
    isShipmentOptionsError,
    isShipmentOptionsLoading,
    isOrderItemsUpdating,
    isRepetitionConflictError,
    returnSourceAddress
  } = action;

  switch (type) {
    case REQUEST_ORDER_DETAILS:
      return {
        ...state,
        isLoading: true,
        paymentUpdated: false,
        isNewPaymentUpdating: false,
        billingAddressesVisible: false
      };
    case RECEIVE_ORDER_DETAILS:
      const newOrder = {
        ...order,
        lineItems: injectUniqueIdsToLineItems(order)
      };
      return {
        ...state,
        order: newOrder,
        isLoading: false,
        isPaymentUpdating: false,
        paymentUpdated: false
      };
    case UPDATE_CANCELLATION_REASON:
      let reasons;
      const existingItem = state.cancellationReasons.find(reason => reason.lineItem === cancellationReasonByLineItem.lineItem);

      if (!existingItem) {
        reasons = state.cancellationReasons.concat([cancellationReasonByLineItem]);
      } else {
        reasons = state.cancellationReasons.map(item => (item === existingItem ? cancellationReasonByLineItem : item));
      }

      return {
        ...state,
        cancellationReasons: reasons
      };
    case REQUEST_CONFIRM_CANCELLATION:
      return {
        ...state,
        isCancellationLoading: true,
        isCancellationError: false
      };
    case RECEIVE_CONFIRM_CANCELLATION:
      return {
        ...state,
        isCancellationLoading: false,
        isCancellationConfirmed: true,
        isCancellationError: false
      };
    case RECEIVE_CONFIRM_CANCELLATION_ERROR:
      return {
        ...state,
        isCancellationLoading: false,
        isCancellationConfirmed: false,
        isCancellationError: true
      };
    case ORDER_CLEAR_SELECTED_ITEMS:
      return {
        ...state,
        selectedItems: [],
        cancellationReasons: [],
        isCancellationConfirmed: false,
        isCancellationError: false
      };
    case REQUEST_UPDATE_ASSOCIATED_PAYMENT:
    case REQUEST_UPDATE_UNASSOCIATED_PAYMENT:
      return {
        ...state,
        isPaymentUpdating: true,
        paymentUpdateError: false
      };
    case RECEIVE_UPDATE_PAYMENT_SUCCESS:
      return {
        ...state,
        paymentUpdated: true,
        paymentUpdateError: false,
        isAddNewBillingAddressUpdating: false
      };
    case RECEIVE_UPDATE_PAYMENT_ERROR:
      return {
        ...state,
        isPaymentUpdating: false,
        paymentUpdateError: true
      };
    case REQUEST_ADD_NEW_PAYMENT:
      return { ...state, isNewPaymentUpdating: true };
    case RECEIVE_ADD_NEW_PAYMENT_SUCCESS:
      return {
        ...state,
        newPaymentInstrumentId,
        billingAddressesVisible: true,
        isNewPaymentUpdating: false
      };
    case RECEIVE_ADD_NEW_PAYMENT_ERROR:
      return {
        ...state,
        isNewPaymentUpdating: false,
        newPaymentError: true,
        newPaymentErrorDetails: error
      };
    case RECEIVE_BILLING_ADDRESSES:
      return {
        ...state,
        addresses,
        isNewPaymentUpdating: false
      };
    case TOGGLE_ADD_NEW_BILLING_ADDRESS:
      return {
        ...state,
        addNewBillingAddressVisible: visible,
        addNewBillingAddressError: false,
        addNewBillingAddressErrorDetails: null
      };
    case REQUEST_ADD_NEW_BILLING_ADDRESS:
      return { ...state, isAddNewBillingAddressUpdating: true };
    case RECEIVE_ADD_NEW_BILLING_ADDRESS_ERROR:
      return {
        ...state,
        isAddNewBillingAddressUpdating: false,
        addNewBillingAddressError: true,
        addNewBillingAddressErrorDetails: error
      };
    case RECEIVE_SUGGESTED_ADDRESSES:
      return {
        ...state,
        isAddNewBillingAddressUpdating: false,
        addNewBillingAddressError: false,
        suggestedAddresses: suggestedAddresses,
        newAddressId: newAddressId
      };
    case UPDATE_ORDER_WITH_TRACKING_INFO:
      const newOrderWithTracking = {
        ...order,
        lineItems: injectTrackingToLineItems(order, trackingInfo)
      };
      return {
        ...state,
        order: newOrderWithTracking
      };
    case CLEAR_VIEWED_ORDER:
      return { ...initialState };
    case SET_SHIPMENT_OPTIONS:
      return {
        ...state,
        shipmentOptions
      };
    case SET_RETURN_SOURCE_ADDRESS:
      return {
        ...state,
        returnSourceAddress
      };
    case SET_IS_SHIPMENT_OPTIONS_ERROR:
      return {
        ...state,
        isShipmentOptionsError: isShipmentOptionsError
      };
    case SET_IS_SHIPMENT_OPTIONS_LOADING:
      return {
        ...state,
        isShipmentOptionsLoading: isShipmentOptionsLoading
      };

    case SET_IS_ORDER_ITEMS_UPDATING:
      return {
        ...state,
        isOrderItemsUpdating
      };

    case SET_IS_REPETITION_CONFLICT_ERROR:
      return {
        ...state,
        isRepetitionConflictError
      };
    default:
      return state;
  }
}
