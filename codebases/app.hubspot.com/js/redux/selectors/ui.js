'use es6';

import { createSelector } from 'reselect';
import { getUi } from '.';
export var getLinkShorteningDomains = createSelector([getUi], function (ui) {
  return ui.get('linkShorteningDomains');
});
export var getBulkActionDialogIsOpen = createSelector([getUi], function (ui) {
  return ui.get('bulkActionDialogIsOpen');
});
export var getBulkAction = createSelector([getUi], function (ui) {
  return ui.get('bulkActionType');
});
export var getBulkActionLoading = createSelector([getUi], function (ui) {
  return ui.get('isBulkActionLoading');
});
export var getVisibleShepherdPopover = createSelector([getUi], function (ui) {
  return ui.get('visibleShepherdPopover');
});