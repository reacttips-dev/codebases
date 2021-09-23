'use es6';

import { SENDER_PROPERTIES_INIT } from '../actionTypes';
import * as PropertyApi from 'sales-modal/api/PropertyApi';
import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import { CONTACT_PROPERTIES_FETCH_SUCCEEDED, COMPANY_PROPERTIES_FETCH_SUCCEEDED, DEAL_PROPERTIES_FETCH_SUCCEEDED, TICKET_PROPERTIES_FETCH_SUCCEEDED } from '../actionTypes';
import Raven from 'Raven';
import partial from 'transmute/partial';
export var fetchContactPropertiesSucceeded = partial(simpleAction, CONTACT_PROPERTIES_FETCH_SUCCEEDED);
export var fetchCompanyPropertiesSucceeded = partial(simpleAction, COMPANY_PROPERTIES_FETCH_SUCCEEDED);
export var fetchDealPropertiesSucceeded = partial(simpleAction, DEAL_PROPERTIES_FETCH_SUCCEEDED);
export var fetchTicketPropertiesSucceeded = partial(simpleAction, TICKET_PROPERTIES_FETCH_SUCCEEDED);
export var initSenderProperties = simpleAction(SENDER_PROPERTIES_INIT);

var logError = function logError(err, propertyType) {
  return Raven.captureMessage("[sales-modal] Failed to fetch " + propertyType + " properties", {
    extra: {
      statusCode: err.status,
      statusText: err.statusText,
      responseText: err.responseText
    }
  });
};

export var fetchContactProperties = function fetchContactProperties() {
  return function (dispatch) {
    PropertyApi.fetchContactProperties().then(function (payload) {
      return dispatch(fetchContactPropertiesSucceeded(payload));
    }, function (err) {
      return logError(err, 'contact');
    });
  };
};
export var fetchCompanyProperties = function fetchCompanyProperties() {
  return function (dispatch) {
    PropertyApi.fetchCompanyProperties().then(function (payload) {
      return dispatch(fetchCompanyPropertiesSucceeded(payload));
    }, function (err) {
      return logError(err, 'company');
    });
  };
};
export var fetchDealProperties = function fetchDealProperties() {
  return function (dispatch) {
    PropertyApi.fetchDealProperties().then(function (payload) {
      return dispatch(fetchDealPropertiesSucceeded(payload));
    }, function (err) {
      return logError(err, 'deal');
    });
  };
};
export var fetchTicketProperties = function fetchTicketProperties() {
  return function (dispatch) {
    PropertyApi.fetchTicketProperties().then(function (payload) {
      return dispatch(fetchTicketPropertiesSucceeded(payload));
    }, function (err) {
      return logError(err, 'ticket');
    });
  };
};
export var fetchProperties = function fetchProperties() {
  return function (dispatch) {
    fetchContactProperties()(dispatch);
    fetchCompanyProperties()(dispatch);
    fetchDealProperties()(dispatch);
    fetchTicketProperties()(dispatch);
    dispatch(initSenderProperties);
  };
};