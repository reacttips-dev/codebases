'use es6';

import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import { fetchAndHydrateConnectedAccounts } from 'SequencesUI/api/ConnectedAccountsApi';
import { CONNECTED_ACCOUNTS_FETCH_SUCCEEDED } from '../constants/SequenceActionTypes';
export var fetchConnectedAccountsSucceeded = createAction(CONNECTED_ACCOUNTS_FETCH_SUCCEEDED, identity);
export var fetchConnectedAccounts = function fetchConnectedAccounts() {
  return function (dispatch, getState) {
    if (!getState().connectedAccounts) {
      fetchAndHydrateConnectedAccounts().then(function (response) {
        return dispatch(fetchConnectedAccountsSucceeded(response));
      });
    }
  };
};