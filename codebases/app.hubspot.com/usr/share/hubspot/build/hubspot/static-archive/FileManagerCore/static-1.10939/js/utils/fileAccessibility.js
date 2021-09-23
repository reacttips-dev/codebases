'use es6';

import PortalIdParser from 'PortalIdParser';
import { PathToFileAccessibility } from '../Constants';
import { VISIBLE_IN_APP_PRIVATE_NOT_INDEXABLE, VISIBLE_IN_APP_PUBLIC_TO_ALL_INDEXABLE, VISIBLE_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE } from '../enums/InternalFileManagerFileAccess';
import { FileVisibilityOptionNames } from '../enums/FileVisibilityOptions';
var FORM_UPLOADS_FOLDER_NAME = 'form-uploads';
export function getIsFileAccessibleAnonymously(file) {
  var isFilePubliclyAccessible = file.getIn(PathToFileAccessibility);
  return isFilePubliclyAccessible !== null && isFilePubliclyAccessible !== undefined ? Boolean(isFilePubliclyAccessible) : true;
}
export function getIsFileSubmittedThroughForms(file) {
  var fileCloudKey = file.get('cloud_key') || '';
  return fileCloudKey.indexOf("hubfs/" + PortalIdParser.get() + "/" + FORM_UPLOADS_FOLDER_NAME) > -1;
}
export function getIsFileExternal(file) {
  return !getIsFileAccessibleAnonymously(file) && getIsFileSubmittedThroughForms(file);
}
export function getIsFilePrivate(file) {
  return !getIsFileAccessibleAnonymously(file) && !getIsFileSubmittedThroughForms(file);
}
export function getIsFilePublic(file) {
  return getIsFileAccessibleAnonymously(file);
}
export var getIsFileIndexable = function getIsFileIndexable(file) {
  return file.get('is_indexable');
};
export var getFileAccess = function getFileAccess(file) {
  if (getIsFilePrivate(file) || getIsFileExternal(file)) {
    return VISIBLE_IN_APP_PRIVATE_NOT_INDEXABLE;
  }

  return getIsFileIndexable(file) ? VISIBLE_IN_APP_PUBLIC_TO_ALL_INDEXABLE : VISIBLE_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE;
};
export var getVisibilityOptionForFile = function getVisibilityOptionForFile(file) {
  if (file.getIn(PathToFileAccessibility) && file.get('is_indexable')) {
    return FileVisibilityOptionNames.VISIBLE_TO_ALL;
  }

  if (file.getIn(PathToFileAccessibility) && !file.get('is_indexable')) {
    return FileVisibilityOptionNames.VISIBLE_TO_USERS_HIDDEN_FROM_SEARCH_ENGINES;
  }

  return FileVisibilityOptionNames.HIDDEN_FROM_ALL;
};