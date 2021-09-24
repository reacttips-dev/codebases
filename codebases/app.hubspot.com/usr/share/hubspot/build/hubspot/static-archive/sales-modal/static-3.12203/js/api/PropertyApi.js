'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var CONTACT_OBJECT_TYPE_ID = '0-1';
var COMPANY_OBJECT_TYPE_ID = '0-2';
var DEAL_OBJECT_TYPE_ID = '0-3';
var TICKET_OBJECT_TYPE_ID = '0-5';
export function fetchContactProperties() {
  var url = "properties/v4/groups/" + CONTACT_OBJECT_TYPE_ID;
  return apiClient.get(url, {
    query: {
      includeProperties: true
    }
  }).then(fromJS).then(function (response) {
    return response.get('results');
  });
}
export function fetchCompanyProperties() {
  var url = "properties/v4/groups/" + COMPANY_OBJECT_TYPE_ID;
  return apiClient.get(url, {
    query: {
      includeProperties: true
    }
  }).then(fromJS).then(function (response) {
    return response.get('results');
  });
}
export function fetchDealProperties() {
  var url = "properties/v4/groups/" + DEAL_OBJECT_TYPE_ID;
  return apiClient.get(url, {
    query: {
      includeProperties: true
    }
  }).then(fromJS).then(function (response) {
    return response.get('results');
  });
}
export function fetchTicketProperties() {
  var url = "properties/v4/groups/" + TICKET_OBJECT_TYPE_ID;
  return apiClient.get(url, {
    query: {
      includeProperties: true
    }
  }).then(fromJS).then(function (response) {
    return response.get('results');
  });
}