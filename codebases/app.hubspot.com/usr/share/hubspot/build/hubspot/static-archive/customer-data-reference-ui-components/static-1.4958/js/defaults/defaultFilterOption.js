'use es6';

import { makeFuzzyRegExp } from 'customer-data-objects/search/FieldSearch';
import memoizeLast from 'transmute/memoizeLast';
import UISelect from 'UIComponents/input/UISelect';
var memoizedMakeFuzzyRegExp = memoizeLast(makeFuzzyRegExp);
export var defaultFilterOption = function defaultFilterOption(option, query) {
  var queryStringWithNoDiacritics = UISelect.stripDiacritics(query);
  var fuzzy = memoizedMakeFuzzyRegExp(queryStringWithNoDiacritics);
  var optionTextWithNoDiacritics = option.text && UISelect.stripDiacritics(option.text);
  var optionHelpTextWithNoDiacritics = option.help && UISelect.stripDiacritics(option.help);
  return Boolean(optionTextWithNoDiacritics && fuzzy.test(optionTextWithNoDiacritics) || optionHelpTextWithNoDiacritics && fuzzy.test(optionHelpTextWithNoDiacritics));
};