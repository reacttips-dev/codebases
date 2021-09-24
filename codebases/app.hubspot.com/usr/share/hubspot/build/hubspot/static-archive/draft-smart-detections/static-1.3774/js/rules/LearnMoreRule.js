'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL } from './lib/suggestionDegrees';
import LearnMoreRuleDescription from './components/LearnMoreRuleDescription';
export default (function (next) {
  return function (bodyState, subjectState, context) {
    var title = getSuggestionCopy('learnMoreRuleTitle');

    var description = /*#__PURE__*/_jsx(LearnMoreRuleDescription, {});

    var suggestion = createSuggestion(title, description, NORMAL);
    return next(bodyState, subjectState, context).push(suggestion);
  };
});