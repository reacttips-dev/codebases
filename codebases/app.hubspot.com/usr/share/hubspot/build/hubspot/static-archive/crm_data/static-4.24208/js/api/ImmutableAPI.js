'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import http from 'hub-http/clients/apiClient';
import { DELETE, GET, PATCH, POST, PUT } from '../constants/HTTPVerbs';
import Immutable, { Map as ImmutableMap, Record } from 'immutable';
import partial from 'transmute/partial';
import { parseUrl } from 'hub-http/helpers/url';
var ALL_NUMS_RE = /\d+/g;
var EMAIL_RE = /\S+@\S+\.\S+/g;
var NOT_FOUND_STATUS_CODE = 404;
var RATE_LIMIT_STATUS_CODE = 429; // these two codes should not get filtered. we have a number of APIs we expect
// to 404 often (e.g. /profile endpoint for deduping new contacts), and we
// can assume that if an API is rate limited then it's not actively causing
// problems and can safely be retried.

var ALWAYS_ALLOW_CODES = [NOT_FOUND_STATUS_CODE, RATE_LIMIT_STATUS_CODE]; // 4 retries === 5 total requests

var MAX_API_RETRIES = 4; // 5 minutes in milliseconds

var RETRY_RATE_LIMIT_TTL = 300000; // rate limit newrelic events to avoid firing too many

var NR_SAMPLE_RATE = 0.5; // only send timeouts if page is visible, can't do anything about background
// API timeouts, that's just due to throttling

var shouldSendToNewRelic = function shouldSendToNewRelic() {
  return document.visibilityState === 'visible' && Math.random() < NR_SAMPLE_RATE;
};

export var RateLimitRecord = Record({
  count: 0,
  lastUpdated: 0
});

RateLimitRecord.count = function () {
  var oldRecord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RateLimitRecord();
  var increment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return oldRecord.merge({
    count: oldRecord.count + increment,
    lastUpdated: Date.now()
  });
};

RateLimitRecord.clear = function (oldRecord) {
  return oldRecord.merge({
    count: 0,
    lastUpdated: Date.now()
  });
};

export function getMethod(verb) {
  switch (verb) {
    case DELETE:
      return http.delete;

    case GET:
      return http.get;

    case PATCH:
      return http.patch;

    case POST:
      return http.post;

    case PUT:
      return http.put;

    default:
      throw new Error("Unknown http method `" + verb + "`");
  }
}

function getAccept(dataType) {
  switch (dataType) {
    case 'html':
      return 'text/html';

    case 'text':
      return 'text/plain';

    default:
      return undefined;
    // this will make hub-http default to application/json
  }
}

function toJS(data) {
  if (!data || typeof data.toJSON !== 'function') {
    return data;
  }

  return data.toJSON();
}

export function sanitizeURI(path) {
  var pathParts = (parseUrl(path).path || '').split('/');
  var sanitizedParts = pathParts.map(function (part) {
    return decodeURIComponent(part).replace(EMAIL_RE, '*').replace(ALL_NUMS_RE, '*');
  });
  return sanitizedParts.join('/');
}
var clientErrorCounts = ImmutableMap();
export function trackClientErrorRetries(error, uri) {
  var clientErrors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImmutableMap();
  uri = sanitizeURI(uri);

  if (error && error instanceof Error && error.status >= 400 && error.status <= 499 && !ALWAYS_ALLOW_CODES.includes(error.status)) {
    return clientErrors.set(uri, RateLimitRecord.count(clientErrors.get(uri)));
  }

  return clientErrors;
}
export function maxRetriesExceeded(uri) {
  var clientErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  uri = sanitizeURI(uri);
  var recordForURI = clientErrors.get(uri, RateLimitRecord());

  if (Date.now() - recordForURI.lastUpdated > RETRY_RATE_LIMIT_TTL) {
    clientErrors = clientErrors.remove(uri);
    return false;
  }

  return recordForURI.count > MAX_API_RETRIES;
}
export function send(config, uri, data) {
  var fromJS = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Immutable.fromJS;

  var type = config.type,
      dataType = config.dataType,
      options = _objectWithoutProperties(config, ["type", "dataType"]);

  if (type === GET) {
    options.query = toJS(data);
  } else {
    options.data = toJS(data);
  }

  var accept = getAccept(dataType);

  if (accept) {
    options.headers = options.headers || {};
    options.headers.Accept = accept;
  }

  if (maxRetriesExceeded(uri, clientErrorCounts)) {
    // If making changes to RETRY_RATE_LIMIT_TTL, adjust the "5 minutes" text below
    return Promise.reject(new Error("ImmutableAPI: max retries exceeded for URI " + sanitizeURI(uri) + " (" + MAX_API_RETRIES + " retries in 5 minutes})"));
  }

  return getMethod(type)(uri, options).then(function (response) {
    return response ? fromJS(response) : response;
  }).catch(function (error) {
    // handle all TIMEOUT errors and send to newrelic for alerting purposes
    // https://git.hubteam.com/HubSpot/Critsit/issues/807
    if (error && error.errorCode === 'TIMEOUT') {
      var url = error.options && error.options.url || '';

      if (!url) {
        // no URL associated with timeout. just rethrow.
        // shouldn't be possible
        throw error;
      }

      var path = sanitizeURI(url);

      if (window.newrelic && window.newrelic.addPageAction && shouldSendToNewRelic()) {
        window.newrelic.addPageAction('crmApiTimeout', {
          apiPath: path
        });
      }
    }

    clientErrorCounts = trackClientErrorRetries(error, uri, clientErrorCounts);
    throw error;
  });
}

function make(type) {
  return partial(send, {
    type: type
  });
}

export var del = make(DELETE);
export { del as delete };
export var get = make(GET);
export var patch = make(PATCH);
export var post = make(POST);
export var put = make(PUT);