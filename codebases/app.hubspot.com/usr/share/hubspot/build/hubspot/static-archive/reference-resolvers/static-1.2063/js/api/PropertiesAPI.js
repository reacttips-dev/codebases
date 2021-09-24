'use es6';

import http from 'hub-http/clients/apiClient';
import curry from 'transmute/curry';
import get from 'transmute/get';
import map from 'transmute/map';
import indexBy from 'transmute/indexBy';
import memoize from 'transmute/memoize';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import formatProperties from '../formatters/formatProperties';
import formatPropertyGroups from '../formatters/formatPropertyGroups';
var BASE_URI = 'properties/v4';
var propertyGetters = {
  getId: get('name'),
  getLabel: get('label'),
  getDescription: get('description')
};
var indexById = indexBy(get('id'));
var getResults = get('results');
var getProperty = get('property');
var mapToProperties = map(getProperty);
var toAllPropertiesUrl = memoize(function (objectTypeId) {
  return BASE_URI + "/" + objectTypeId;
});
var toMultiGetPropertiesUrl = memoize(function (objectTypeId) {
  return BASE_URI + "/" + objectTypeId + "/multi-get";
});
var toMultiGetResultsList = curry(function (names, response) {
  return names.map(function (name) {
    return response[name];
  });
});

var makeFetcher = function makeFetcher(httpClient, objectType) {
  return function () {
    return httpClient.get(BASE_URI + "/groups/" + objectType + "?includeProperties=true").then(getResults).then(formatProperties);
  };
};

export var createGetContactProperties = function createGetContactProperties(_ref) {
  var httpClient = _ref.httpClient;
  return makeFetcher(httpClient, 'CONTACT');
};
export var getContactProperties = createGetContactProperties({
  httpClient: http
});
export var createGetConversationProperties = function createGetConversationProperties(_ref2) {
  var httpClient = _ref2.httpClient;
  return makeFetcher(httpClient, 'CONVERSATION');
};
export var getConversationProperties = createGetConversationProperties({
  httpClient: http
});
export var createGetCompanyProperties = function createGetCompanyProperties(_ref3) {
  var httpClient = _ref3.httpClient;
  return makeFetcher(httpClient, 'COMPANY');
};
export var getCompanyProperties = createGetCompanyProperties({
  httpClient: http
});
export var createGetDealProperties = function createGetDealProperties(_ref4) {
  var httpClient = _ref4.httpClient;
  return makeFetcher(httpClient, 'DEAL');
};
export var getDealProperties = createGetDealProperties({
  httpClient: http
});
export var createGetTicketProperties = function createGetTicketProperties(_ref5) {
  var httpClient = _ref5.httpClient;
  return makeFetcher(httpClient, 'TICKET');
};
export var getTicketProperties = createGetTicketProperties({
  httpClient: http
});
export var createGetLineItemProperties = function createGetLineItemProperties(_ref6) {
  var httpClient = _ref6.httpClient;
  return makeFetcher(httpClient, 'LINE_ITEM');
};
export var getLineItemProperties = createGetLineItemProperties({
  httpClient: http
});
export var createGetProductProperties = function createGetProductProperties(_ref7) {
  var httpClient = _ref7.httpClient;
  return makeFetcher(httpClient, 'PRODUCT');
};
export var getProductProperties = createGetProductProperties({
  httpClient: http
});
export var createGetQuoteProperties = function createGetQuoteProperties(_ref8) {
  var httpClient = _ref8.httpClient;
  return makeFetcher(httpClient, 'QUOTE');
};
export var getQuoteProperties = createGetQuoteProperties({
  httpClient: http
});
export var createGetPropertyGroupsByObjectType = function createGetPropertyGroupsByObjectType(_ref9) {
  var httpClient = _ref9.httpClient;
  return function () {
    var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        queryParams = _ref10.queryParams;

    return function (objectTypes) {
      var promises = objectTypes.map(function (objectType) {
        return httpClient.get(BASE_URI + "/groups/" + objectType, {
          query: queryParams
        }).then(getResults).then(function (results) {
          return {
            objectType: objectType.toUpperCase(),
            results: results
          };
        });
      });
      return Promise.all(promises).then(formatPropertyGroups);
    };
  };
};
export var getPropertyGroupsByObjectType = createGetPropertyGroupsByObjectType({
  httpClient: http
})();
export var createGetPropertyGroupsByObjectTypeId = function createGetPropertyGroupsByObjectTypeId(_ref11) {
  var httpClient = _ref11.httpClient;
  return function (objectTypeId) {
    var _ref12 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        queryParams = _ref12.queryParams;

    var getFn = createGetPropertyGroupsByObjectType({
      httpClient: httpClient
    })({
      queryParams: Object.assign({
        includeProperties: true
      }, queryParams)
    });
    return function () {
      return getFn([objectTypeId]);
    };
  };
};
export var getPropertyGroupsByObjectTypeId = createGetPropertyGroupsByObjectTypeId({
  httpClient: http
});
export var createGetAllProperties = function createGetAllProperties(_ref13) {
  var httpClient = _ref13.httpClient;
  return function (objectTypeId) {
    var _ref14 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        queryParams = _ref14.queryParams;

    return function () {
      return httpClient.get(toAllPropertiesUrl(objectTypeId), {
        query: queryParams
      }).then(mapToProperties).then(formatToReferencesList(propertyGetters)).then(indexById);
    };
  };
};
export var getAllProperties = createGetAllProperties({
  httpClient: http
});
export var createGetProperties = function createGetProperties(_ref15) {
  var httpClient = _ref15.httpClient;
  return curry(function (objectTypeId, _ref16, names) {
    var queryParams = _ref16.queryParams;
    return httpClient.post(toMultiGetPropertiesUrl(objectTypeId), {
      query: queryParams,
      data: names
    }).then(toMultiGetResultsList(names)).then(mapToProperties).then(formatToReferencesList(propertyGetters));
  });
};
export var getProperties = createGetProperties({
  httpClient: http
});