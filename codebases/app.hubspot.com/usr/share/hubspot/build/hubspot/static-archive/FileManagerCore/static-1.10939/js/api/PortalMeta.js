'use es6';

import apiClient from 'hub-http/clients/apiClient';
import { fromJS } from 'immutable';
import PortalMetaCategoryIds from '../enums/PortalMetaCategoryIds';
import { getCategoryName } from '../utils/portalMeta';
var BASE_URL = 'filemanager/api/v3/portal-meta';
export function fetchFileManagerPortalData() {
  return apiClient.get(BASE_URL).then(fromJS);
}
export function updatePortalMeta(_ref) {
  var category = _ref.category,
      category_value = _ref.category_value;
  var categoryName = getCategoryName(category);
  var data = {
    category: category,
    category_value: category_value
  };
  var query = {
    categoryName: categoryName
  };
  return apiClient.post(BASE_URL + "/upsert", {
    data: data,
    query: query
  }).then(fromJS);
}
export function updateVidyardTosStatus(status) {
  return updatePortalMeta({
    category: PortalMetaCategoryIds.VIDYARD_TOS_STATUS,
    category_value: status
  });
}
export function updateVideoPQLDismissFlag(hasDismissedVideoPQL) {
  return updatePortalMeta({
    category: PortalMetaCategoryIds.DISMISS_VIDEO_PQL_V1,
    category_value: hasDismissedVideoPQL
  });
}