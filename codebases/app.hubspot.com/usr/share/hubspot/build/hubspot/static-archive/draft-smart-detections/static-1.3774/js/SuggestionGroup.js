'use es6';

import composeRules from './composeRules';
import { MIN_BODY_CHARACTER_COUNT } from './rules/lib/suggestionConstants';
export default (function () {
  for (var _len = arguments.length, rules = new Array(_len), _key = 0; _key < _len; _key++) {
    rules[_key] = arguments[_key];
  }

  return function (next) {
    for (var _len2 = arguments.length, depArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      depArgs[_key2 - 1] = arguments[_key2];
    }

    return function (bodyState, subjectState, context) {
      var suggestions = next(bodyState, subjectState, context);
      var currentContentState = bodyState.getCurrentContent();
      var bodyPlainText = currentContentState.getPlainText();
      var bodyLength = bodyPlainText.length;

      if (bodyLength < MIN_BODY_CHARACTER_COUNT) {
        return suggestions;
      }

      var suggestionGroupSuggestions = composeRules.apply(void 0, rules).apply(void 0, depArgs)(bodyState, subjectState);
      return suggestions.concat(suggestionGroupSuggestions);
    };
  };
});