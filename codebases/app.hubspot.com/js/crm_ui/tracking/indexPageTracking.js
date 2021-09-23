'use es6';

import { CrmLogger } from 'customer-data-tracking/loggers';
export var track = function track(eventName, properties) {
  return CrmLogger.log(eventName, properties);
};
export var LOG_INDEX_PAGE_VIEW_TYPES = {
  BOARD_VIEW: 'board view',
  LIST_VIEW: 'list view'
};
export var trackIndexPageView = function trackIndexPageView(_ref) {
  var viewType = _ref.viewType,
      typeDef = _ref.typeDef;
  return track('indexPageview', {
    viewType: viewType,
    objectTypeId: typeDef.objectTypeId,
    objectTypeName: typeDef.name,
    screen: typeDef.objectTypeId,
    subscreen: viewType
  });
};
export var trackOpenPreviewSidebar = function trackOpenPreviewSidebar() {
  return track('indexInteractions', {
    action: 'open record preview sidebar'
  });
};
export var trackOpenAllViewsPage = function trackOpenAllViewsPage() {
  return track('filterInteractions', {
    action: 'view saved views'
  });
};
export var trackOpenMoreFiltersPanel = function trackOpenMoreFiltersPanel() {
  return track('filterInteractions', {
    action: 'open advanced filters'
  });
};
export var trackOpenEditColumnsModal = function trackOpenEditColumnsModal(typeDef) {
  return track('indexInteractions', {
    action: 'open edit columns modal',
    objectTypeId: typeDef.objectTypeId,
    objectTypeName: typeDef.name
  });
};
export var trackEditSavedView = function trackEditSavedView() {
  return track('editSavedView');
};
export var trackDeleteView = function trackDeleteView() {
  return track('filterUsage', {
    action: 'delete saved view'
  });
};
export var trackCreateView = function trackCreateView(_ref2) {
  var isClone = _ref2.isClone;
  return track('createSavedView', {
    action: isClone ? 'saved filter as new custom view' : 'created view from dropdown menu',
    fromClone: isClone
  });
};