'use es6';

import I18n from 'I18n';
export var getFileFilteringErrorMessageKey = function getFileFilteringErrorMessageKey(filterType) {
  return "FileManagerLib.panels.tiles." + filterType;
};
export var getFileFilteringErrorMessageOptions = function getFileFilteringErrorMessageOptions(extensions) {
  return {
    count: extensions.count(),
    extensions: I18n.formatList(extensions.map(function (extension) {
      return "." + extension;
    }).toArray())
  };
};
export var getFileFilteringErrorMessage = function getFileFilteringErrorMessage(extensions, filterType) {
  return I18n.text(getFileFilteringErrorMessageKey(filterType), getFileFilteringErrorMessageOptions(extensions));
};