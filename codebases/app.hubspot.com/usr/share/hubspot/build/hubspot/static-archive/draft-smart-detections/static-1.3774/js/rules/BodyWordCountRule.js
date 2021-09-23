'use es6';

import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL, MAJOR } from './lib/suggestionDegrees';
var MAX_WORD_COUNT = 180;
var SEVERE_WORD_COUNT = 250;
export default (function (next) {
  return function (bodyState, subjectState, context) {
    var suggestions = next(bodyState, subjectState, context);
    var blockMap = bodyState.getCurrentContent().getBlockMap();
    var wordCount = blockMap.reduce(function (count, contentBlock) {
      return count + contentBlock.getText().trim().split(' ').length;
    }, 0);

    if (wordCount > MAX_WORD_COUNT) {
      var isSevere = wordCount > SEVERE_WORD_COUNT;
      var degree = isSevere ? MAJOR : NORMAL;
      var title = getSuggestionCopy('bodyWordCountTitle');
      var description = isSevere ? getSuggestionCopy('bodyWordCountDescriptionSevere', {
        wordCount: wordCount
      }) : getSuggestionCopy('bodyWordCountDescription', {
        wordCount: wordCount
      });
      var suggestion = createSuggestion(title, description, degree);
      return suggestions.push(suggestion);
    }

    return suggestions;
  };
});