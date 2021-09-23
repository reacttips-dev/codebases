'use es6';

import { isMigratedObjectTypeId } from '../rewrite/init/utils/isMigratedObjectTypeId';
import { parseObjectTypeIdFromPath } from '../rewrite/init/utils/parseObjectTypeIdFromPath';
var baseQuickFetchConfig = {
  timeout: 15000,
  dataType: 'json',
  contentType: 'application/json',
  type: 'GET'
};
var pathname = window.location.pathname;
var objectTypeId = parseObjectTypeIdFromPath(pathname);
var encodedTypeId = encodeURIComponent(objectTypeId);

if (isMigratedObjectTypeId(objectTypeId)) {
  window.quickFetch.makeEarlyRequest('views', Object.assign({}, baseQuickFetchConfig, {
    url: window.quickFetch.getApiUrl("/sales/v3/views/" + encodedTypeId + "?count=20000")
  }));
  window.quickFetch.makeEarlyRequest('properties', Object.assign({}, baseQuickFetchConfig, {
    url: window.quickFetch.getApiUrl("/properties/v4/" + encodedTypeId + "?includeFieldLevelPermission=true")
  }));
  window.quickFetch.afterAuth(function (_ref) {
    var enabled_gates = _ref.portal.enabled_gates;

    if (enabled_gates.includes('CRM:Datasets:PinnedViewsBackendRedesign')) {
      window.quickFetch.makeEarlyRequest('pinnedViewDefinitions', Object.assign({}, baseQuickFetchConfig, {
        url: window.quickFetch.getApiUrl("/sales/v3/views/" + encodedTypeId + "/pinned/view?count=5")
      }));
    } else {
      window.quickFetch.makeEarlyRequest('pinnedViews', Object.assign({}, baseQuickFetchConfig, {
        url: window.quickFetch.getApiUrl("/sales/v3/views/" + encodedTypeId + "/pinned?count=5")
      }));
    }
  });

  if (pathname.match('/board')) {
    window.quickFetch.makeEarlyRequest('boardCard', Object.assign({}, baseQuickFetchConfig, {
      url: window.quickFetch.getApiUrl("/crm-record-cards/v3/views/" + encodedTypeId + "?location=OBJECT_BOARD")
    }));
  }
}