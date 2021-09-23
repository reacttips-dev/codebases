'use es6';

import Raven from 'Raven';
import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import { fetch } from '../api/IntegrationsApi';
import * as LSNIntegrationActionTypes from '../constants/LSNIntegrationActionTypes';
export var LINKED_IN_SALES_NAVIGATOR_APP_ID_PROD = 42082;
export var LINKED_IN_SALES_NAVIGATOR_APP_ID_QA = 1161054;
export var fetchStarted = createAction(LSNIntegrationActionTypes.FETCH_QUEUED, identity);
export var fetchSucceeded = createAction(LSNIntegrationActionTypes.FETCH_SUCCEEDED, identity);
export var fetchFailed = createAction(LSNIntegrationActionTypes.FETCH_FAILED, identity);
export var fetchLSNIntegration = function fetchLSNIntegration() {
  return function (dispatch) {
    dispatch(fetchStarted());
    return fetch().then(function (response) {
      var connected = response.some(function (integration) {
        return integration.get('id') === LINKED_IN_SALES_NAVIGATOR_APP_ID_PROD || integration.get('id') === LINKED_IN_SALES_NAVIGATOR_APP_ID_QA;
      });
      dispatch(fetchSucceeded(connected));
    }, function (err) {
      Raven.captureMessage('Integrations fetch error', {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText
        }
      });
      dispatch(fetchFailed());
    });
  };
};