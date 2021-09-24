'use es6';

import http from 'hub-http/clients/apiClient';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import get from 'transmute/get';
import formatIntegrationProperties from 'reference-resolvers/formatters/formatIntegrationProperties';
import formatIntegrationNames from 'reference-resolvers/formatters/formatIntegrationNames';
import promiseClient from 'hub-http/adapters/promiseClient';
import * as core from 'hub-http/middlewares/core';
import * as hubapi from 'hub-http/middlewares/hubapi';
import * as debug from 'hub-http/middlewares/debug';
import * as externalAuth from 'hub-http/middlewares/externalAuth';
import { createStack } from 'hub-http';
var BASE_URL = '/integrators/v1';
var EVENT_TYPE_BASE_URL = BASE_URL + "/portal-installs/event-types";
var APP_BASE_URL = BASE_URL + "/applications";
export var createGetIntegrations = function createGetIntegrations(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get(EVENT_TYPE_BASE_URL).then(formatToReferencesList({
      getId: get('id'),
      getLabel: get('name')
    }));
  };
};
export var getIntegrations = createGetIntegrations({
  httpClient: http
});
export var createGetIntegrationPropertiesById = function createGetIntegrationPropertiesById(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.post(EVENT_TYPE_BASE_URL + "/properties", {
      data: {
        ids: ids
      }
    }).then(function (response) {
      return formatIntegrationProperties(response);
    });
  };
};
export var getIntegrationPropertiesById = createGetIntegrationPropertiesById({
  httpClient: http
}); // same as hubapiStack but without core.jsonResponse

export var integrationsHttpClient = promiseClient(createStack(core.services, hubapi.defaults, debug.allowTimeoutOverride, core.jsonBody, core.httpsOnly, hubapi.hubapi, externalAuth.cookieAuthentication, core.withQuery, debug.rewriteUrl, hubapi.timeoutInQuery, core.reportOptionsError, hubapi.logoutOnUnauthorized, hubapi.retryOnError, core.validateStatus));
export var createGetIntegrationNameByAppId = function createGetIntegrationNameByAppId(_ref3) {
  var httpClient = _ref3.httpClient;
  return function (appIds) {
    return Promise.all(appIds.map(function (appId) {
      if (appId) {
        return httpClient.get(APP_BASE_URL + "/" + appId + "/name").then(function (integrationName) {
          return {
            appId: appId,
            integrationName: integrationName
          };
        }, function (error) {
          return {
            appId: appId,
            error: error
          };
        });
      }

      return null;
    })).then(formatIntegrationNames);
  };
};
export var getIntegrationNameByAppId = createGetIntegrationNameByAppId({
  httpClient: integrationsHttpClient
});