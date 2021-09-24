'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL } from './lib/suggestionDegrees';
import QuestionCountDescription from './components/QuestionCountDescription';
var MIN_QUESTION_COUNT = 1;
var MAX_QUESTION_COUNT = 3;
export default (function (next) {
  return function (bodyState, subjectState, context) {
    var suggestions = next(bodyState, subjectState, context);
    var text = bodyState.getCurrentContent().getPlainText();
    var questions = text.match(/(\w\?+)$|(\w\?+)\s/g);
    var questionCount = questions === null ? 0 : questions.length;

    if (questionCount < MIN_QUESTION_COUNT || questionCount > MAX_QUESTION_COUNT) {
      var title = getSuggestionCopy('bodyQuestionCountTitle', {
        questionCount: questionCount
      });

      var description = /*#__PURE__*/_jsx(QuestionCountDescription, {
        questionCount: questionCount
      });

      var suggestion = createSuggestion(title, description, NORMAL);
      return suggestions.push(suggestion);
    }

    return suggestions;
  };
});