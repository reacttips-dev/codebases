'use es6';

import { Map as ImmutableMap, List, fromJS } from 'immutable';
import http from 'hub-http/clients/apiClient';
var baseUrl = 'snippets/v1/render';
export var defaultApiWrapper = function defaultApiWrapper(apiClient) {
  return {
    fetchRenderedContent: function fetchRenderedContent(_ref) {
      var id = _ref.id,
          contactEmail = _ref.contactEmail,
          contactVid = _ref.contactVid,
          objectType = _ref.objectType,
          subjectId = _ref.subjectId;
      var supplementalObject = subjectId && subjectId !== 'null' && subjectId !== 'undefined' ? {
        supplementalObjectType: objectType,
        supplementalObjectId: subjectId
      } : {};
      return apiClient.get(baseUrl, {
        query: Object.assign({
          id: id,
          toEmail: contactEmail,
          vid: contactVid
        }, supplementalObject)
      });
    },
    fetchUnrenderedContent: function fetchUnrenderedContent(_ref2) {
      var id = _ref2.id;
      return apiClient.get("snippets/v1/snippets/" + id);
    },
    searchSnippets: function searchSnippets(_ref3) {
      var count = _ref3.count,
          offset = _ref3.offset,
          query = _ref3.query;
      return apiClient.post('salescontentsearch/v2/search', {
        data: {
          contentTypesToHydrate: ['SNIPPET'],
          filters: [{
            field: 'content_type',
            values: ['SNIPPET']
          }],
          limit: count,
          offset: offset,
          query: query
        }
      }).then(function (response) {
        return fromJS(response);
      });
    }
  };
};
export var fetchAllSnippets = function fetchAllSnippets() {
  return http.get('snippets/v1/snippets').then(function (response) {
    return ImmutableMap({
      hasMore: false,
      offset: 0,
      count: response.length,
      total: response.length,
      results: List(response).map(function (snippet) {
        return fromJS(snippet);
      })
    });
  });
};
export var searchSnippets = function searchSnippets(_ref4) {
  var count = _ref4.count,
      offset = _ref4.offset,
      query = _ref4.query;
  return http.post('salescontentsearch/v2/search', {
    data: {
      contentTypesToHydrate: ['SNIPPET'],
      filters: [{
        field: 'content_type',
        values: ['SNIPPET']
      }],
      limit: count,
      offset: offset,
      query: query
    }
  }).then(function (response) {
    return fromJS(response);
  });
};