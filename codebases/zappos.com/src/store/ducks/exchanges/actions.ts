import {
  EXCHANGES_ADD_OR_EDIT_ADDRESS_EVENT,
  EXCHANGES_CLOSE_SELECT_ADDRESS,
  EXCHANGES_DELETE_ADDRESS,
  EXCHANGES_EDIT_ADDRESS,
  EXCHANGES_ON_CHANGE_SHIPPING_CLICK,
  EXCHANGES_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  EXCHANGES_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK,
  EXCHANGES_ON_USE_SHIPPING_ADDRESS_CLICK,
  EXCHANGES_REQUEST_ALL_ADDRESSES,
  EXCHANGES_SAVE_ADDRESS,
  EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS,
  EXCHANGES_SET_SELECTED_SHIPPING_ADDRESS_ID,
  EXCHANGES_SET_SELECTED_SUGGESTED_ADDRESS_ID,
  EXCHANGES_USE_SUGGESTED_ADDRESS,
  EXCHANGES_VERIFY_ADDRESS_PAGEVIEW,
  ExchangesTypes
} from 'store/ducks/exchanges/types';

export const onSetPrimaryShippingAddress = (selectedAddressId: string): ExchangesTypes => ({
  type: EXCHANGES_SET_PRIMARY_SHIPPING_ADDRESS,
  selectedAddressId
});

export const onUseShippingAddressClick = (
  selectedAddressId: string,
  isValid: boolean,
): ExchangesTypes => ({
  type: EXCHANGES_ON_USE_SHIPPING_ADDRESS_CLICK,
  selectedAddressId,
  isValid
});

export const onChangeShippingAddressClick = (): ExchangesTypes => ({
  type: EXCHANGES_ON_CHANGE_SHIPPING_CLICK
});

export const onEditAddressClick = (
  editAddressId: string,
  editAddressIndex: number,
): ExchangesTypes => ({
  type: EXCHANGES_EDIT_ADDRESS,
  editAddressId,
  editAddressIndex
});

export const onUseSuggestedAddressClick = (
  addressType: number,
  selectedAddressId: string,
): ExchangesTypes => ({
  type: EXCHANGES_USE_SUGGESTED_ADDRESS,
  addressType,
  selectedAddressId
});

export const onAddOrEditAddressEvent = (
  passedValidation: boolean,
  addressId: string,
  addressType: number,
): ExchangesTypes => ({
  type: EXCHANGES_ADD_OR_EDIT_ADDRESS_EVENT,
  passedValidation,
  addressId,
  addressType
});

export const onAddOrEditShippingAddressErrorEvent = (): ExchangesTypes => ({
  type: EXCHANGES_ADD_OR_EDIT_ADDRESS_EVENT,
  passedValidation: false,
  addressId: null,
  addressType: 2
});

export const onDeleteShipAddressClick = (addressId: string): ExchangesTypes => ({
  type: EXCHANGES_DELETE_ADDRESS,
  addressId
});

export const saveShippingAddress = (): ExchangesTypes => ({
  type: EXCHANGES_SAVE_ADDRESS,
  isBilling: false
});

export const onSelectedShippingAddress = (selectedAddressId: string): ExchangesTypes => ({
  type: EXCHANGES_SET_SELECTED_SHIPPING_ADDRESS_ID,
  selectedAddressId
});

export const onSelectedSuggestedShippingAddress = (
  selectedAddressId: string,
  selectedAddressIndex: number,
): ExchangesTypes => ({
  type: EXCHANGES_SET_SELECTED_SUGGESTED_ADDRESS_ID,
  selectedAddressId,
  selectedAddressIndex
});

export const requestAddresses = (): ExchangesTypes => ({ type: EXCHANGES_REQUEST_ALL_ADDRESSES });

export const onHideNewShippingAddressModalClick = (): ExchangesTypes => ({
  type: EXCHANGES_ON_HIDE_NEW_SHIPPING_ADDRESS_MODAL_CLICK
});

export const onShowAddNewShippingAddressModalClick = (): ExchangesTypes => ({
  type: EXCHANGES_ON_SHOW_ADD_NEW_SHIPPING_ADDRESS_MODAL_CLICK
});

export const onCloseSelectShippingAddressListClick = (): ExchangesTypes => ({
  type: EXCHANGES_CLOSE_SELECT_ADDRESS
});

export const onVerifyAddressPageView = (): ExchangesTypes => ({
  type: EXCHANGES_VERIFY_ADDRESS_PAGEVIEW
});
