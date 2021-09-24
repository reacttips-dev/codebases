'use es6';

import Raven from 'Raven';
import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import getConnectedAccount from 'sales-modal/utils/enrollModal/getConnectedAccount';
import * as ConnectedAccountsApi from 'sales-modal/api/ConnectedAccountsApi';
import { CONNECTED_ACCOUNTS } from 'sales-modal/constants/ActionNamespaces';
import { SELECT_SENDER } from '../actionTypes';
import { getFromAddress, getInboxAddress } from '../selectors/SenderSelectors';
import { EnrollTypes } from '../../constants/EnrollTypes';
import SenderRecord from 'sales-modal/data/SenderRecord';
var STARTED = CONNECTED_ACCOUNTS + "_FETCH_STARTED";
var SUCCEEDED = CONNECTED_ACCOUNTS + "_FETCH_SUCCEEDED";
var FAILED = CONNECTED_ACCOUNTS + "_FETCH_FAILED";
export var initConnectedAccounts = function initConnectedAccounts() {
  return function (dispatch, getState) {
    var state = getState();
    var salesModalInterface = state.salesModalInterface,
        enrollType = state.enrollType;
    var clientSignature = salesModalInterface.signature,
        selectConnectedAccount = salesModalInterface.selectConnectedAccount,
        useCachedConnectedAccount = salesModalInterface.useCachedConnectedAccount,
        user = salesModalInterface.user;
    var fromAddress = getFromAddress(state);
    var inboxAddress = getInboxAddress(state);
    var userEmailAddress = user.get('email').toLowerCase();

    if (enrollType === EnrollTypes.VIEW) {
      dispatch(simpleAction(SUCCEEDED, {
        connectedAccounts: null,
        selectedSender: SenderRecord({
          fromAddress: fromAddress,
          inboxAddress: inboxAddress
        }),
        signature: null
      }));
      return;
    }

    dispatch(simpleAction(STARTED));
    ConnectedAccountsApi.fetchConnectedAccounts().then(function (payload) {
      var connectedAccounts = payload;
      var selectedSender = getConnectedAccount({
        inboxAddress: inboxAddress,
        connectedAccounts: connectedAccounts,
        selectConnectedAccount: selectConnectedAccount,
        useCachedConnectedAccount: useCachedConnectedAccount,
        aliasAddress: fromAddress
      });
      var signature = clientSignature || connectedAccounts.getPrimarySignature(userEmailAddress);
      dispatch(simpleAction(SUCCEEDED, {
        connectedAccounts: connectedAccounts,
        selectedSender: selectedSender,
        signature: signature
      }));
    }, function (err) {
      dispatch(simpleAction(FAILED));
      Raven.captureMessage("[sales-modal] Failed to fetch " + CONNECTED_ACCOUNTS, {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText
        }
      });
    });
  };
};
export var selectSenderRecord = function selectSenderRecord(selectedSenderRecord) {
  return function (dispatch) {
    dispatch(simpleAction(SELECT_SENDER, selectedSenderRecord));
  };
};