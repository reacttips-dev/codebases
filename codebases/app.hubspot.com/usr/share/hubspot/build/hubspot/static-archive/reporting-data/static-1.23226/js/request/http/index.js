'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import enviro from 'enviro';
import apiClient from 'hub-http/clients/apiClient';
import { stringify } from 'hub-http/helpers/params';
import fromJSOrdered from '../../lib/fromJSOrdered';
import { batchRequests as overrideBatchRequests } from '../../lib/overrides';
import { NewRelicInteraction } from '../../monitoring/newrelic';
import connectActions from '../../redux/connectActions';
import reduxStore from '../../redux/store';
import Request from '../Request';
import { client as batchCSClient } from './batchContactsSearch';
import { actions, getRequestState, getState, StatusTypes } from './store';

var rewriteLocalReportingUrls = function rewriteLocalReportingUrls(request) {
  var url = request.url;

  if (url.startsWith('reporting') || url.startsWith('sql-reporting')) {
    return request.set('url', "https://local.hubspot" + (enviro.isQa() ? 'qa' : '') + ".com/" + url);
  }

  return request;
};

var FORM_URLENCODED = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
var DEFAULT_OPTIONS = {
  bust: false,
  ttl: 30000,
  disableTtl: false,
  batchRequests: false,
  useLocalReportingApis: false,
  // throw when trying to make an actual http request
  // (for debugging regression testing)
  cacheOnly: false,
  // indicate whether the request should still cache, even if it errors
  cacheOnError: false,
  // Called when requests are made, used to prune regression calls
  retrieveHook: function retrieveHook() {}
};
var currentOptions = DEFAULT_OPTIONS;
export var setOptions = function setOptions(newOptions) {
  return currentOptions = Object.assign({}, currentOptions, {}, newOptions);
};
export var getOptions = function getOptions() {
  return currentOptions;
};
export var resetOptions = function resetOptions() {
  return currentOptions = DEFAULT_OPTIONS;
};

var _connectActions = connectActions(reduxStore, [actions.addRequest, actions.removeRequest, actions.setRequestStatus]),
    _connectActions2 = _slicedToArray(_connectActions, 3),
    addRequest = _connectActions2[0],
    removeRequest = _connectActions2[1],
    setRequestStatus = _connectActions2[2];

var payload = function payload(_ref) {
  var form = _ref.form,
      data = _ref.data;
  return form.isEmpty() ? {
    data: data.toJS()
  } : {
    data: stringify(form.toJS()),
    headers: FORM_URLENCODED
  };
};

var hubHttp = function hubHttp(request) {
  var adapter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var method = request.method.toLowerCase();
  var fn = adapter[method] || apiClient[method];
  return fn(request.url, Object.assign({}, payload(request), {
    query: request.query.toJS(),
    timeout: request.timeout
  })).then(fromJSOrdered);
};

export var retrieve = function retrieve(rawRequest) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _currentOptions$optio = Object.assign({}, currentOptions, {}, options),
      bust = _currentOptions$optio.bust,
      ttl = _currentOptions$optio.ttl,
      disableTtl = _currentOptions$optio.disableTtl,
      cacheOnly = _currentOptions$optio.cacheOnly,
      batchRequests = _currentOptions$optio.batchRequests,
      useLocalReportingApis = _currentOptions$optio.useLocalReportingApis,
      cacheOnError = _currentOptions$optio.cacheOnError,
      retrieveHook = _currentOptions$optio.retrieveHook;

  var sanitizedRequest = Request.sanitize(rawRequest);
  var request = useLocalReportingApis ? rewriteLocalReportingUrls(sanitizedRequest) : sanitizedRequest;
  retrieveHook(request, options);

  if (bust && !cacheOnly) {
    removeRequest({
      request: request
    });
  }

  var requestState = getRequestState(reduxStore.getState(), request);

  if (requestState && (requestState.status === StatusTypes.SUCCEEDED || requestState.status === StatusTypes.PENDING || cacheOnError)) {
    return requestState.promise;
  }

  var timer = function () {
    var start = Date.now();
    return function () {
      return Date.now() - start;
    };
  }();

  if (cacheOnly) {
    if (requestState && requestState.status === StatusTypes.ERRORED) {
      return Promise.reject(requestState.error);
    }

    throw new Error("Cache missed for " + request);
  }

  var adapter = batchRequests || overrideBatchRequests.enabled ? batchCSClient : {};
  var requestPromise = hubHttp(request, adapter);
  addRequest({
    request: request,
    promise: requestPromise,
    ttl: ttl
  });

  var getTtlTimeout = function getTtlTimeout() {
    return !disableTtl ? setTimeout(function () {
      return removeRequest({
        request: request
      });
    }, ttl) : undefined;
  };

  var nr = new NewRelicInteraction();
  return requestPromise.then(function (response) {
    setRequestStatus({
      request: request,
      response: response,
      status: StatusTypes.SUCCEEDED,
      duration: timer(),
      timeout: getTtlTimeout()
    });
    nr.logHttpSuccess(request, timer());
    return response;
  }).catch(function (error) {
    setRequestStatus({
      request: request,
      error: error,
      status: StatusTypes.ERRORED,
      duration: timer(),
      timeout: getTtlTimeout()
    });
    nr.logHttpError(error, request, timer());
    throw error;
  });
};
export var get = function get(url, request, options) {
  return retrieve(Request.get(Object.assign({
    url: url
  }, request)), options);
};
export var post = function post(url, request, options) {
  return retrieve(Request.post(Object.assign({
    url: url
  }, request)), options);
};
export var put = function put(url, request, options) {
  return retrieve(Request.put(Object.assign({
    url: url
  }, request)), options);
};
export var bustWhen = function bustWhen(condition) {
  var state = getState(reduxStore.getState());
  state.forEach(function (requestState, request) {
    if (condition(requestState)) {
      removeRequest({
        request: request
      });
    }
  });
};
export var bustAll = function bustAll() {
  bustWhen(function () {
    return true;
  });
};
export var bustSettled = function bustSettled() {
  bustWhen(function (requestState) {
    return requestState.status !== StatusTypes.PENDING;
  });
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = module.exports;
}