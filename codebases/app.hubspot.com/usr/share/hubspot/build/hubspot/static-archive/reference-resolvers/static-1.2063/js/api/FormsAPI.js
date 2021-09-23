'use es6';

import http from 'hub-http/clients/apiClient';
import formatForms from 'reference-resolvers/formatters/formatForms';
import omit from 'transmute/omit';
var FORM_PROPERTIES = ['name', 'guid', 'formType'];
var SUPPORTED_FORM_TYPES = ['HUBSPOT', 'FLOW', 'CAPTURED', 'FACEBOOK_LEAD_AD', 'BLOG_COMMENT', 'MEETING', 'TICKET_FORM', 'DOCUMENT', 'VIDEO_FORM'];
export var createGetAllForms = function createGetAllForms(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get("forms/v2/forms?", {
      query: {
        property: FORM_PROPERTIES,
        formTypes: SUPPORTED_FORM_TYPES
      }
    }).then(formatForms);
  };
};
export var getAllForms = createGetAllForms({
  httpClient: http
});
export var createGetFormsByIds = function createGetFormsByIds(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.get('/forms/v2/forms/batch', {
      query: {
        guid: ids
      }
    }).then(formatForms);
  };
};
export var getFormsByIds = createGetFormsByIds({
  httpClient: http
});
export var createSearchForms = function createSearchForms(_ref3) {
  var httpClient = _ref3.httpClient;
  return function (query) {
    var offset = query.get('offset');
    var limit = query.get('count');
    var parsedQuery = Object.assign({}, omit(['query', 'count', 'hasMore'], query).toJS(), {
      formTypes: SUPPORTED_FORM_TYPES,
      limit: limit,
      offset: offset,
      property: FORM_PROPERTIES
    }); // name__contains added separately because querying happens
    // much faster when it is not specified
    // that way there's no need to filter on the BE when query is ""

    if (query.get('query')) {
      parsedQuery.name__contains = query.get('query');
    }

    return httpClient.get('/forms/v2/forms', {
      query: parsedQuery
    }).then(function (forms) {
      var formattedForms = formatForms(forms); // The endpoint returns just a list of forms rather than a paginated response
      // therefore new `offset` and `hasMore` calculated manually
      // `offset` - is set to the previous offset + number of forms fetched in the current request
      // `hasMore` -  is just a best guess we can make, if number of fetched forms is less than a limit
      // requested then we reached the last page otherwise there are more forms to fetch

      return {
        count: formattedForms.size,
        offset: offset + formattedForms.size,
        hasMore: formattedForms.size >= limit,
        results: formattedForms
      };
    });
  };
};
export var searchForms = createSearchForms({
  httpClient: http
});