'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { createAction } from 'redux-actions';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { CALLEE_PROPERTIES, ADD_PHONE_NUMBER_PROPERTY, RESET_ADD_PHONE_NUMBER_PROPERTY, REMOVE_PHONE_NUMBER_PROPERTY } from './asyncActionTypes';
import { logCallingError } from 'calling-error-reporting/report/error';
import { fetchCalleeProperties, addPhoneNumberPropertyAndUpdate, removePhoneNumberPropertyAPI } from '../clients/calleePropertiesClient';
import { createPropertyKey } from 'calling-lifecycle-internal/callees/operators/getPropertyKeys';
import { CallableObject } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
import { fetchSingleCalleeClient } from 'calling-lifecycle-internal/callees/clients/calleesClient';
export var calleePropertiesToRecordFn = function calleePropertiesToRecordFn(responses) {
  try {
    var finalResponse = ImmutableMap();
    responses.forEach(function (response) {
      if (response.value) {
        var _response$value = response.value,
            ids = _response$value.ids,
            results = _response$value.results,
            objectTypeId = _response$value.objectTypeId;
        ids.forEach(function (objectId) {
          if (!results || !results[objectId]) {
            finalResponse = finalResponse.set(createPropertyKey({
              objectTypeId: objectTypeId,
              objectId: objectId
            }), null);
            return;
          }

          finalResponse = finalResponse.set(createPropertyKey({
            objectTypeId: objectTypeId,
            objectId: objectId
          }), fromJS(results[objectId]));
        });
      }
    });
    return finalResponse;
  } catch (e) {
    logCallingError({
      errorMessage: 'Error parsing Callee properties',
      extraData: {
        error: e,
        responses: responses
      }
    });
    return null;
  }
};
export var addNumberPropertyToRecordFn = function addNumberPropertyToRecordFn(response) {
  try {
    // response is {[calleeId]: {...properties}}
    var key = Object.keys(response)[0];
    return fromJS(response[key]);
  } catch (e) {
    logCallingError({
      errorMessage: 'Error adding property to record',
      extraData: {
        error: e
      }
    });
    return null;
  }
};
export var getCalleeProperties = createAsyncAction({
  actionTypes: CALLEE_PROPERTIES,
  requestFn: fetchCalleeProperties,
  toRecordFn: calleePropertiesToRecordFn
});
export var resetPhoneNumberPropertyStatus = createAction(RESET_ADD_PHONE_NUMBER_PROPERTY);
export var addPhoneNumberProperty = function addPhoneNumberProperty(requestArgs) {
  return function (dispatch) {
    dispatch({
      type: ADD_PHONE_NUMBER_PROPERTY.STARTED,
      payload: {
        requestArgs: requestArgs
      }
    });
    return addPhoneNumberPropertyAndUpdate(requestArgs).then(function () {
      return fetchSingleCalleeClient(requestArgs);
    }).then(function (response) {
      var callableObject = new CallableObject(response);
      dispatch({
        type: ADD_PHONE_NUMBER_PROPERTY.SUCCEEDED,
        payload: {
          requestArgs: requestArgs,
          callee: callableObject
        }
      });
    }).catch(function () {
      dispatch({
        requestArgs: requestArgs,
        type: ADD_PHONE_NUMBER_PROPERTY.FAILED
      });
    });
  };
};
export var removePhoneNumberProperty = function removePhoneNumberProperty(requestArgs) {
  return function (dispatch) {
    dispatch({
      type: REMOVE_PHONE_NUMBER_PROPERTY.STARTED,
      payload: {
        requestArgs: requestArgs
      }
    });
    return removePhoneNumberPropertyAPI(requestArgs).then(function () {
      return fetchSingleCalleeClient(requestArgs);
    }).then(function (response) {
      var callableObject = new CallableObject(response);
      dispatch({
        type: REMOVE_PHONE_NUMBER_PROPERTY.SUCCEEDED,
        payload: {
          requestArgs: requestArgs,
          callee: callableObject
        }
      });
    }).catch(function () {
      dispatch({
        requestArgs: requestArgs,
        type: REMOVE_PHONE_NUMBER_PROPERTY.FAILED
      });
    });
  };
};