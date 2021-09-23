'use es6';

import PortalIdParser from 'PortalIdParser';
var GET = 'get';
var POST = 'post';
export var standardBaseUrl = 'external-options/v2';
export var toStandardFetchUrl = function toStandardFetchUrl(baseUrl, referenceType, objectTypeId) {
  return objectTypeId ? baseUrl + "/fetch/" + objectTypeId + "/" + referenceType : baseUrl + "/fetch/" + referenceType;
};
export var toStandardSearchUrl = function toStandardSearchUrl(baseUrl, referenceType, objectTypeId) {
  return objectTypeId ? baseUrl + "/pagedFetch/" + objectTypeId + "/" + referenceType : baseUrl + "/pagedFetch/" + referenceType;
};
export var toStandardFetchOptions = function toStandardFetchOptions(fetchOptions, referenceType, objectTypeId) {
  return Object.assign({}, fetchOptions, {
    portalId: PortalIdParser.get(),
    referenceType: referenceType,
    objectTypeId: objectTypeId
  });
};
export var createFetchAll = function createFetchAll(_ref) {
  var fetchOptions = _ref.fetchOptions,
      http = _ref.http,
      _ref$method = _ref.method,
      method = _ref$method === void 0 ? GET : _ref$method,
      queryParams = _ref.queryParams,
      url = _ref.url;
  return function () {
    var options = {};

    if (method === GET) {
      options.query = queryParams;
    } else {
      options.data = fetchOptions;
    }

    return http[method](url, options);
  };
};
export var createFetchByIds = function createFetchByIds(_ref2) {
  var fetchOptions = _ref2.fetchOptions,
      http = _ref2.http,
      _ref2$method = _ref2.method,
      method = _ref2$method === void 0 ? POST : _ref2$method,
      queryParams = _ref2.queryParams,
      url = _ref2.url;
  return function (ids) {
    var options = {};

    if (method === GET) {
      options.query = Object.assign({}, queryParams, {
        ids: ids
      });
    } else {
      options.data = Object.assign({}, fetchOptions, {
        ids: ids
      });
    }

    return http[method](url, options);
  };
};
export var createSearch = function createSearch(_ref3) {
  var searchOptions = _ref3.searchOptions,
      http = _ref3.http,
      _ref3$method = _ref3.method,
      method = _ref3$method === void 0 ? GET : _ref3$method,
      queryParams = _ref3.queryParams,
      url = _ref3.url;
  return function (query) {
    var options = {};

    if (method === GET) {
      options.query = Object.assign({}, queryParams, {}, query);
    } else {
      options.data = Object.assign({}, searchOptions, {}, query);
    }

    return http[method](url, options);
  };
};