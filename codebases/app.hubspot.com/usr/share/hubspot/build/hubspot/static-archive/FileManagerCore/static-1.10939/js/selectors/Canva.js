'use es6';

import { createSelector } from 'reselect';
import { getFileFromProps } from './Folders';

var getCanva = function getCanva(state) {
  return state.canva;
};

var getFilter = function getFilter(state) {
  return state.filter;
};

export var getCanvaDownloadStatus = createSelector([getCanva], function (canva) {
  return canva.get('downloadStatus');
});
export var getCanvaInitStatus = createSelector([getCanva], function (canva) {
  return canva.get('initStatus');
});
export var getCanvaIsSupportedForFilter = createSelector([getFilter], function (filter) {
  if (!filter) {
    return true;
  }

  var extensions = filter.get('extensions');
  var filterType = filter.get('filterType');
  var isSupportedForFilter;

  switch (filterType) {
    case 'NONE':
      isSupportedForFilter = true;
      break;

    case 'SUPPORTED':
      isSupportedForFilter = Boolean(extensions.includes('png'));
      break;

    case 'UNSUPPORTED':
      isSupportedForFilter = !extensions.includes('png');
      break;

    default:
      isSupportedForFilter = true;
      break;
  }

  return isSupportedForFilter;
});
export var getIsCanvaFile = createSelector([getFileFromProps], function (file) {
  return file.hasIn(['meta', 'canva_id']);
});