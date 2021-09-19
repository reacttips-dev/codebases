import { call, put, select } from 'redux-saga/effects';

import {
  changeAddress,
  deleteAddress,
  getAddressList,
  getAutocompleteSuggestions,
  getLatLong,
  setPrimaryAddress
} from 'apis/checkout';
import {
  CLEAR_ADDRESS_FORM_ITEM,
  GET_ADDRESSES_SUCCESS,
  SET_ADDRESS_AUTOCOMPLETE_SUGGESTIONS,
  SET_ADDRESS_DATA_LOADING,
  SET_ADDRESS_LAT_LONG,
  SET_INVALID_ADDRESS_FIELDS,
  SET_SUGGESTED_ADDRESSES
} from 'store/ducks/address/types';
import {
  getAddressesIsLoaded,
  getAddressFormItem,
  getMafiaAndCredentials,
  getPurchaseAddresses,
  getPurchaseShippingAddress
} from 'store/ducks/readFromStore';
import { withSession } from 'store/ducks/session/sagas';

export function* workFetchLatLong(query) {
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  const { payload } = yield call(withSession, [getLatLong, mafia, query, credentials]);
  yield put({ type: SET_ADDRESS_LAT_LONG, payload });
}

export function* workLoadAutocompleteSuggestions(query, near, countryCode) {
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  const { payload } = yield call(withSession, [getAutocompleteSuggestions, mafia, query, near, countryCode, credentials]);
  yield put({ type: SET_ADDRESS_AUTOCOMPLETE_SUGGESTIONS, payload });
}

export function* workRequestAddresses() {
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  yield put({ type: SET_ADDRESS_DATA_LOADING, payload: true });
  const { payload } = yield call(withSession, [getAddressList, mafia, credentials]);
  yield put({ type: GET_ADDRESSES_SUCCESS, payload });
}

export function* workDeleteAddress(addressId) {
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  const { payload: { results } } = yield call(withSession, [deleteAddress, mafia, addressId, credentials]);
  const [{ success }] = results;
  return success;
}

export function* workUpdateAddress() {
  yield put({ type: SET_ADDRESS_DATA_LOADING, payload: true });
  const address = yield select(getAddressFormItem);
  const { mafia, credentials } = yield select(getMafiaAndCredentials);
  const { payload } = yield call(withSession, [changeAddress, mafia, address, credentials]);
  const { invalidFields, suggestedAddresses, valid, addressId } = payload;

  if (valid) {
    yield put({ type: CLEAR_ADDRESS_FORM_ITEM });
    return addressId;
  } else {
    if (suggestedAddresses?.length) {
      yield put({ type: SET_SUGGESTED_ADDRESSES, payload: suggestedAddresses });
    } else {
      yield put({ type: SET_INVALID_ADDRESS_FIELDS, payload: invalidFields });
    }
  }
}

/*
If there is no primary address on the account, and there is a shipping address on the purchase,
save the shipping address as the primary address on the account.

Having a primary address is a requirement for saving a payment as primary.

This scenario could only appear for folks messing with addresses in My Account.
*/
export function* workSetPrimaryAddressIfNone() {
  const isLoaded = yield select(getAddressesIsLoaded);

  if (!isLoaded) {
    yield call(workRequestAddresses);
  }

  const savedAddresses = yield select(getPurchaseAddresses);

  const primaryAddress = (savedAddresses || []).find(
    item => item.isDefaultShippingAddress);

  const shippingAddressId = yield select(getPurchaseShippingAddress);

  if (!primaryAddress && shippingAddressId) {
    const shippingAddress = (savedAddresses || []).find(
      item => item.addressId === shippingAddressId);

    const address = {
      ...shippingAddress,
      isDefaultShippingAddress: true
    };

    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    yield call(withSession, [setPrimaryAddress, mafia, address, credentials]);
  }
}

export default [];
