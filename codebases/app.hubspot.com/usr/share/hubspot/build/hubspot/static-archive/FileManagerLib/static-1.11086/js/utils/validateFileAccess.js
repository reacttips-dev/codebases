'use es6';

import { DrawerFileAccess, DropZoneWithBrowseFileAccess, DropZoneNoBrowseFileAccess } from '../enums/FileAccess';

var getIsFileAccessValidByType = function getIsFileAccessValidByType(uploadedFileAccess, FileAccessEnum) {
  return Object.keys(FileAccessEnum).includes(uploadedFileAccess);
};

export var getIsDropZoneNoBrowseFileAccessValid = function getIsDropZoneNoBrowseFileAccessValid(uploadedFileAccess) {
  return getIsFileAccessValidByType(uploadedFileAccess, DropZoneNoBrowseFileAccess);
};
export var getIsDrawerFileAccessValid = function getIsDrawerFileAccessValid(uploadedFileAccess) {
  return getIsFileAccessValidByType(uploadedFileAccess, DrawerFileAccess);
};
export var getIsConfigureFileManagerFileAccessValid = getIsDrawerFileAccessValid;
export var getIsDropZoneWithBrowseFileAccessValid = function getIsDropZoneWithBrowseFileAccessValid(uploadedFileAccess) {
  return getIsFileAccessValidByType(uploadedFileAccess, DropZoneWithBrowseFileAccess);
};