'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import FileExtensionFilters from '../enums/FileExtensionFilters';
import { getFileFilteringErrorMessage } from './i18n';
import { getIsFileExternal, getIsFilePrivate } from 'FileManagerCore/utils/fileAccessibility';
import { getThumbnailTooltipI18nKey } from 'FileManagerCore/utils/thumbnailTooltip';
export var getIsFileExtensionNotSupported = function getIsFileExtensionNotSupported(fileExtension, extensions, filterType) {
  if (filterType === FileExtensionFilters.NONE) {
    return false;
  }

  var isFileInExtensions = extensions.has(fileExtension);
  return filterType === FileExtensionFilters.SUPPORTED ? !isFileInExtensions : isFileInExtensions;
};

var getNotSupportedReason = function getNotSupportedReason(extensions, reasons, fileExtension, filterType) {
  return reasons.get(fileExtension) || getFileFilteringErrorMessage(extensions, filterType);
};

export var isInsertFileDisabled = function isInsertFileDisabled(file, isHostAppContextPrivate) {
  return getIsFileExternal(file) || getIsFilePrivate(file) && !isHostAppContextPrivate;
};
export var addSupportInfoToFiles = function addSupportInfoToFiles(files, filter, isHostAppContextPrivate) {
  var extensions = filter.get('extensions');
  var reasons = filter.get('reasons');
  var filterType = filter.get('filterType');
  return files.map(function (file) {
    if (extensions.count() && filterType !== FileExtensionFilters.NONE) {
      var fileExtension = file.get('extension');
      var notSupported = getIsFileExtensionNotSupported(fileExtension, extensions, filterType);

      if (notSupported) {
        return file.merge({
          notSupported: notSupported,
          notSupportedReason: notSupported && getNotSupportedReason(extensions, reasons, fileExtension, filterType)
        });
      }
    }

    if (isInsertFileDisabled(file, isHostAppContextPrivate)) {
      return file.merge({
        notSupported: true,
        notSupportedReason: I18n.text(getThumbnailTooltipI18nKey(file, isHostAppContextPrivate))
      });
    }

    return file;
  });
};
export var getFileExtensionFromRawFile = function getFileExtensionFromRawFile(rawFile) {
  return rawFile.name.split('.').pop();
};
export var isExtensionFromRawFileSupported = function isExtensionFromRawFileSupported(rawFile, filter) {
  return !getIsFileExtensionNotSupported(getFileExtensionFromRawFile(rawFile), filter.get('extensions'), filter.get('filterType'));
};
export var buildFilterFromPOJOs = function buildFilterFromPOJOs(filterType, filteredExtensions, filteredReasons) {
  return ImmutableMap({
    extensions: ImmutableSet(filteredExtensions),
    reasons: ImmutableMap(filteredReasons),
    filterType: filterType || FileExtensionFilters.NONE
  });
};
export var getIsDrawerWithFileExtensionFilterConfigValid = function getIsDrawerWithFileExtensionFilterConfigValid() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var filteredExtensionsSet = ImmutableSet(props.filteredExtensions);

  if (props.filterType !== FileExtensionFilters.NONE) {
    return filteredExtensionsSet.size > 0;
  }

  return true;
};