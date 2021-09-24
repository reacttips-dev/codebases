'use es6';

import hubHttp from 'hub-http/clients/apiClient';
import { Promise } from '../../lib/promise';
var BASE_URL = 'contacts/search/v1/report';
var CRM_SEARCH_BASE_URL = 'crm-search/report';
var MAX_QUEUE = 5;
var MAX_WAIT = 250;

var getUrl = function getUrl(objectType, isMulti) {
  return BASE_URL + "/" + objectType + (isMulti ? '/multi' : '');
};

var getCrmSearchUrl = function getCrmSearchUrl(isMulti) {
  return "" + CRM_SEARCH_BASE_URL + (isMulti ? '/multi' : '') + "/beta";
};

var parse = function parse(url) {
  var tail = url.replace(BASE_URL, '');
  var parts = tail.split('/').filter(function (s) {
    return s !== '';
  });
  var isMulti = parts[parts.length - 1] === 'multi';

  if (isMulti) {
    parts.pop();
  }

  var objectType = parts.join('/');
  return {
    objectType: objectType,
    isMulti: isMulti
  };
};

var match = function match(url) {
  return url.startsWith(BASE_URL) && parse(url).objectType !== 'quotas';
};

var matchCrmSearch = function matchCrmSearch(url) {
  return url.includes(CRM_SEARCH_BASE_URL);
};

var makeBatchedClient = function makeBatchedClient(objectType) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$maxWait = _ref.maxWait,
      maxWait = _ref$maxWait === void 0 ? MAX_WAIT : _ref$maxWait,
      _ref$useCrmSearch = _ref.useCrmSearch,
      useCrmSearch = _ref$useCrmSearch === void 0 ? false : _ref$useCrmSearch;

  var multiUrl = useCrmSearch ? getCrmSearchUrl(true) : getUrl(objectType, true);
  var timeout = null;
  var queue = [];

  var flush = function flush() {
    var requestPayload = queue.reduce(function (batchedPayload, currentRequest) {
      var isMulti = currentRequest.isMulti,
          payload = currentRequest.options.data;
      var index = batchedPayload.length;

      currentRequest.getResponse = function (batchedResponse) {
        return isMulti ? batchedResponse.slice(index, index + payload.length) : batchedResponse[index];
      };

      return batchedPayload.concat(isMulti ? payload : [payload]);
    }, []);
    var flushed = queue;
    hubHttp.post(multiUrl, {
      data: requestPayload
    }).then(function (batchedResponse) {
      flushed.forEach(function (request) {
        var response = request.getResponse(batchedResponse);
        request.defer.resolve(response);
      });
    }).catch(function (e) {
      flushed.forEach(function (request) {
        request.defer.reject(e);
      });
    });
    queue = [];
    clearTimeout(timeout);
    timeout = null;
  };

  return {
    post: function post(url, options) {
      var _parse = parse(url),
          isMulti = _parse.isMulti;

      return new Promise(function (resolve, reject) {
        queue.push({
          url: url,
          options: options,
          isMulti: isMulti,
          defer: {
            resolve: resolve,
            reject: reject
          }
        });

        if (queue.length >= MAX_QUEUE) {
          flush();
          return;
        }

        timeout = !timeout ? setTimeout(flush, maxWait) : timeout;
      });
    }
  };
};

var batchedClients = {};
export var client = {
  post: function post(url, options) {
    var _options$data = options.data,
        objectTypeId = _options$data.objectTypeId,
        portalId = _options$data.portalId;
    var useCrmSearch = matchCrmSearch(url) && objectTypeId && portalId;

    if (!match(url) && !useCrmSearch) {
      return hubHttp.post(url, options);
    }

    var objectType = useCrmSearch ? objectTypeId : parse(url).objectType;
    var batchedClient = batchedClients[objectType];

    if (!batchedClient) {
      batchedClient = makeBatchedClient(objectType, {
        useCrmSearch: useCrmSearch
      });
      batchedClients[objectType] = batchedClient;
    }

    return batchedClient.post(url, options);
  }
};
export var __TESTABLE__ = {
  parse: parse,
  match: match,
  makeBatchedClient: makeBatchedClient
};