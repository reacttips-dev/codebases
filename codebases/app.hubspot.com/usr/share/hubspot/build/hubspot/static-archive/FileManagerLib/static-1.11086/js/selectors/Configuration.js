'use es6';

import { createSelector } from 'reselect';
import PrivateContextBenderProjectList from '../enums/PrivateContextBenderProjectList';
import { getIsUngatedForBypassElasticSearch } from 'FileManagerCore/selectors/Auth';

var getConfiguration = function getConfiguration(state) {
  return state.configuration;
};

export var getIsShutterstockEnabled = createSelector([getConfiguration], function (configuration) {
  return configuration.get('withShutterstock') === true;
});
export var getIsCanvaEnabled = createSelector([getConfiguration], function (configuration) {
  return configuration.get('withCanva') === true;
});
export var getSpecificCanvaTemplates = createSelector([getConfiguration], function (configuration) {
  return configuration.get('specificCanvaTemplates');
});
export var getHostApp = createSelector([getConfiguration], function (configuration) {
  return configuration.get('hostApp');
});
export var getUseEsFileSearch = createSelector([getIsUngatedForBypassElasticSearch], function (isBypassUngated) {
  return !isBypassUngated;
});
export var getUploadedFileAccess = createSelector([getConfiguration], function (configuration) {
  return configuration.get('uploadedFileAccess');
});
export var getIsHostAppContextPrivate = createSelector([getHostApp], function (hostApp) {
  return PrivateContextBenderProjectList.includes(hostApp);
});