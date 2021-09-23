'use es6';

import http from 'hub-http/clients/apiClient';
import * as ViewIdMapping from '../../../crm_ui/views/ViewIdMapping';
import { generatePath } from 'react-router-dom';
import { makeQuickFetchedRequest } from '../../../utils/makeQuickFetchedRequest';
import { PinnedViewLimit } from '../constants/PinnedViewLimit';

var getUrl = function getUrl(objectTypeId) {
  return generatePath('sales/v3/views/:objectTypeId/pinned', {
    objectTypeId: objectTypeId
  });
}; // TODO: Remove ViewIdMapping when BE understands strings
// See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/310 for context


var parseResponse = function parseResponse(response) {
  return response ? response.map(ViewIdMapping.lookup) : [];
};

var quickFetchedPinnedViews = makeQuickFetchedRequest('pinnedViews', function (objectTypeId) {
  return http.get(getUrl(objectTypeId), {
    query: {
      count: 5
    }
  });
});
export var getPinnedViews = function getPinnedViews(objectTypeId) {
  return quickFetchedPinnedViews(objectTypeId).then(function (response) {
    return parseResponse(response.results);
  });
};
export var writePinnedViews = function writePinnedViews(_ref) {
  var objectTypeId = _ref.objectTypeId,
      ids = _ref.ids;
  return http.put(getUrl(objectTypeId), {
    // TODO: Remove ViewIdMapping when BE understands strings
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/310 for context
    data: ids.map(ViewIdMapping.get)
  });
};
export var getPinnedViewDefinitions = makeQuickFetchedRequest('pinnedViewDefinitions', function (_ref2) {
  var objectTypeId = _ref2.objectTypeId;
  return http.get(generatePath('sales/v3/views/:objectTypeId/pinned/view', {
    objectTypeId: objectTypeId
  }), {
    query: {
      count: PinnedViewLimit
    }
  });
});