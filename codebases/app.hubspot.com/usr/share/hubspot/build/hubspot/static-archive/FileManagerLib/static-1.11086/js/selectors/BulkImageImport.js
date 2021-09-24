'use es6';

import { createSelector } from 'reselect';

var getBulkImageImport = function getBulkImageImport(state) {
  return state.bulkImageImport;
};

export var getStep = createSelector([getBulkImageImport], function (panel) {
  return panel.get('selectedStep');
});
export var getCrawlId = createSelector([getBulkImageImport], function (panel) {
  return panel.get('crawlId');
});
export var getImportId = createSelector([getBulkImageImport], function (panel) {
  return panel.get('importId');
});
export var getPreviews = createSelector([getBulkImageImport], function (panel) {
  return panel.get('previews');
});
export var areAllSelected = createSelector([getPreviews], function (previews) {
  return previews.filter(function (preview) {
    return preview.selected;
  }).size === previews.size && previews.size !== 0;
});
export var getPreviewURIs = createSelector([getPreviews], function (previews) {
  return previews.keySeq().toArray();
});
export var getSelectedPreviews = createSelector([getPreviews], function (previews) {
  return previews.filter(function (preview) {
    return preview.selected;
  }).toList();
});
export var getHasPreviews = createSelector([getPreviews], function (previews) {
  return previews.size > 0;
});
export var getCanImport = createSelector([getSelectedPreviews], function (selectedURIs) {
  return selectedURIs.size > 0;
});
export var makeGetPreviewByURI = function makeGetPreviewByURI() {
  return createSelector(getPreviews, function (_, uri) {
    return uri;
  }, function (previews, uri) {
    return previews.get(uri);
  });
};
export var getIsValidatingImages = createSelector([getBulkImageImport], function (panel) {
  return panel.get('isValidatingImages');
});