'use es6';

import I18n from 'I18n';
var emptyGroup;
export var getEmptyGroup = function getEmptyGroup() {
  emptyGroup = emptyGroup || {
    disabled: true,
    text: I18n.text('salesUI.UITypeahead.noOptions'),
    value: '__EMPTY_GROUP__'
  };
  return emptyGroup;
};
var noMatchesOption;
export var getNoMatchesOption = function getNoMatchesOption() {
  noMatchesOption = noMatchesOption || {
    disabled: true,
    groupIdx: -1,
    text: I18n.text('salesUI.UITypeahead.noMatchesFound'),
    value: '__EMPTY_OPTION__'
  };
  return noMatchesOption;
};
export var getSearchRegExp = function getSearchRegExp(str) {
  return new RegExp(str.trim().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
};