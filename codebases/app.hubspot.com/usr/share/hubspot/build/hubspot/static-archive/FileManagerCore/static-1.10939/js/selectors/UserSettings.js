'use es6';

import { createSelector } from 'reselect';
import { ShutterstockTosValues, DiscoverabilityPopupDismissed } from '../Constants';
import { getCategoryValues, hasFetchedPortalMeta } from './PortalMeta';
import PortalMetaCategory from '../enums/PortalMetaCategory';
export var getUserSettingsHaveLoaded = hasFetchedPortalMeta;
export var getShutterstockTosAccepted = createSelector([getCategoryValues], function (categoryValues) {
  return categoryValues.get(PortalMetaCategory.SHUTTERSTOCK_TOS) === ShutterstockTosValues.ACCEPTED;
});
export var getShutterstockFolderId = createSelector([hasFetchedPortalMeta, getCategoryValues], function (isFetched, categoryValues) {
  if (isFetched && categoryValues.get(PortalMetaCategory.SHUTTERSTOCK_FOLDER_ID)) {
    var folderId = parseInt(categoryValues.get(PortalMetaCategory.SHUTTERSTOCK_FOLDER_ID), 10);
    return folderId > 0 ? folderId : null;
  }

  return null;
});
export var getHasSeenAdvancedSearchDashboardPopup = createSelector([hasFetchedPortalMeta, getCategoryValues], function (isFetched, categoryValues) {
  if (isFetched) {
    return categoryValues.get(PortalMetaCategory.DASHBOARD_ADVANCED_SEARCH_POPUP) === DiscoverabilityPopupDismissed;
  }

  return null;
});
export var getHasSeenAdvancedSearchPickerPopup = createSelector([hasFetchedPortalMeta, getCategoryValues], function (isFetched, categoryValues) {
  if (isFetched) {
    return categoryValues.get(PortalMetaCategory.PICKER_ADVANCED_SEARCH_POPUP) === DiscoverabilityPopupDismissed;
  }

  return null;
});
export var getShouldShowFilesTrashPopup = createSelector([hasFetchedPortalMeta, getCategoryValues], function (isFetched, categoryValues) {
  return isFetched && categoryValues.get(PortalMetaCategory.FILES_TRASH_POPUP) !== DiscoverabilityPopupDismissed;
});