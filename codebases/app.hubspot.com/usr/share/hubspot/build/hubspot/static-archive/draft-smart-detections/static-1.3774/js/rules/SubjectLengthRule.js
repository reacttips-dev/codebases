'use es6';

import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL, MAJOR } from './lib/suggestionDegrees';
var MAX_SUBJECT_LENGTH = 60;
var SEVERE_SUBJECT_LENGTH = 75;
export default (function (next) {
  return function (bodyState, subjectState, context) {
    var suggestions = next(bodyState, subjectState, context);
    var currentContentState = subjectState.getCurrentContent();
    var subjectPlainText = currentContentState.getPlainText();
    var subjectLength = subjectPlainText.length;

    if (subjectLength > MAX_SUBJECT_LENGTH) {
      var isSevere = subjectLength > SEVERE_SUBJECT_LENGTH;
      var degree = isSevere ? MAJOR : NORMAL;
      var title = getSuggestionCopy('subjectLengthTitle');
      var description = isSevere ? getSuggestionCopy('subjectLengthDescriptionSevere', {
        size: subjectLength
      }) : getSuggestionCopy('subjectLengthDescription', {
        size: subjectLength
      });
      var suggestion = createSuggestion(title, description, degree);
      return suggestions.push(suggestion);
    }

    return suggestions;
  };
});