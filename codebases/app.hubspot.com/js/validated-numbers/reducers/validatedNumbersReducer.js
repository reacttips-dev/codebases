'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _validatedNumbersRedu;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import { stringIdInvariant } from 'conversations-async-data/indexed-async-data/invariants/stringIdInvariant';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { ADD_PHONE_NUMBER_PROPERTY } from '../../callee-properties/actions/asyncActionTypes';
import { VALIDATE_PHONE_NUMBER } from '../constants/validatedNumbersActionTypes';
var initialState = IndexedAsyncData({
  name: 'validatedNumbersReducer',
  idInvariant: stringIdInvariant,
  notSetValue: AsyncData({
    data: null
  })
});
var validatedNumbersReducer = (_validatedNumbersRedu = {}, _defineProperty(_validatedNumbersRedu, VALIDATE_PHONE_NUMBER.STARTED, function (state, _ref) {
  var requestArgs = _ref.payload.requestArgs;
  var phoneNumberIdentifier = requestArgs.phoneNumberIdentifier;
  var phoneNumberKey = phoneNumberIdentifier.toKey();
  return updateEntry(phoneNumberKey, requestStarted, state);
}), _defineProperty(_validatedNumbersRedu, VALIDATE_PHONE_NUMBER.SUCCEEDED, function (state, _ref2) {
  var _ref2$payload = _ref2.payload,
      requestArgs = _ref2$payload.requestArgs,
      data = _ref2$payload.data;
  var phoneNumberIdentifier = requestArgs.phoneNumberIdentifier;
  var phoneNumberKey = phoneNumberIdentifier.toKey();
  return updateEntry(phoneNumberKey, requestSucceededWithOperator(function () {
    return data;
  }), state);
}), _defineProperty(_validatedNumbersRedu, VALIDATE_PHONE_NUMBER.FAILED, function (state, _ref3) {
  var requestArgs = _ref3.payload.requestArgs;
  var phoneNumberIdentifier = requestArgs.phoneNumberIdentifier;
  var phoneNumberKey = phoneNumberIdentifier.toKey();
  return updateEntry(phoneNumberKey, requestFailed, state);
}), _defineProperty(_validatedNumbersRedu, ADD_PHONE_NUMBER_PROPERTY.SUCCEEDED, function (state, _ref4) {
  var payload = _ref4.payload;
  var _payload$requestArgs = payload.requestArgs,
      objectId = _payload$requestArgs.objectId,
      objectTypeId = _payload$requestArgs.objectTypeId,
      property = _payload$requestArgs.property,
      validatedNumber = _payload$requestArgs.validatedNumber;
  var phoneNumberIdentifier = new PhoneNumberIdentifier({
    objectTypeId: objectTypeId,
    objectId: objectId,
    propertyName: property
  });
  var phoneNumberKey = phoneNumberIdentifier.toKey();
  return updateEntry(phoneNumberKey, requestSucceededWithOperator(function () {
    return validatedNumber;
  }), state);
}), _validatedNumbersRedu);
export default handleActions(validatedNumbersReducer, initialState);