'use es6';

import { createSelector } from 'reselect';
import { ImportImageCopyrightNoticeValues, RequestStatus, VidyardTosStatus } from '../Constants';
import { getHasVideoIntegrationScope } from './Auth';
import PortalMetaCategory from '../enums/PortalMetaCategory';
export var getCategoryValues = function getCategoryValues(state) {
  return state.portalMeta.get('categoryValues');
};
export var getVidyardTosStatus = function getVidyardTosStatus(state) {
  return state.portalMeta.get('vidyardTosStatus');
};
export var getFileManagerPortalDataUpdateRequestStatus = function getFileManagerPortalDataUpdateRequestStatus(state) {
  return state.portalMeta.get('updateRequestStatus');
};
export var getFileManagerPortalDataFetchRequestStatus = function getFileManagerPortalDataFetchRequestStatus(state) {
  return state.portalMeta.get('fetchRequestStatus');
};
export var hasFetchedPortalMeta = createSelector([getFileManagerPortalDataFetchRequestStatus], function (status) {
  return status === RequestStatus.SUCCEEDED;
});
export var getIsVideoPQLBannerDismissed = function getIsVideoPQLBannerDismissed(state) {
  return state.portalMeta.get('isVideoPQLBannerDismissed');
};
export var getHasAcceptedImportCopyrightNotice = createSelector([getCategoryValues], function (categoryValues) {
  return categoryValues.get(PortalMetaCategory.IMPORT_IMAGE_COPYRIGHT_NOTICE) === ImportImageCopyrightNoticeValues.ACCEPTED;
});
export var getShouldShowVidyardInitialState = createSelector([getHasVideoIntegrationScope, getVidyardTosStatus, getFileManagerPortalDataFetchRequestStatus], function (hasVideoIntegrationScope, vidyardTosStatus, fetchStatus) {
  return hasVideoIntegrationScope && fetchStatus === RequestStatus.SUCCEEDED && [VidyardTosStatus.NOT_ASKED, VidyardTosStatus.DISABLED, VidyardTosStatus.UNSYNCED].includes(vidyardTosStatus);
});