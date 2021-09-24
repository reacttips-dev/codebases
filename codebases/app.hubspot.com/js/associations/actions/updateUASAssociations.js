'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { updateUASAssociationsAPI } from '../clients/updateUASAssociationsAPI';
import { UPDATE_UAS_ASSOCIATIONS } from './asyncActionTypes';
export var updateUASAssociations = createAsyncAction({
  actionTypes: UPDATE_UAS_ASSOCIATIONS,
  requestFn: updateUASAssociationsAPI,
  toRecordFn: function toRecordFn(res) {
    return res;
  },
  successMetaActionCreator: function successMetaActionCreator(_ref) {
    var data = _ref.data,
        requestArgs = _ref.requestArgs;
    requestArgs.handleFailedAssociations({
      response: data
    });
  },
  failureMetaActionCreator: function failureMetaActionCreator(_ref2) {
    var data = _ref2.data,
        requestArgs = _ref2.requestArgs;
    requestArgs.handleFailedAssociations({
      response: data
    });
  }
});