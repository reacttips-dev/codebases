'use es6';

import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL } from './lib/suggestionDegrees';
var MIN_MERGE_TAGS = 1;

var getMergeTagCount = function getMergeTagCount(editorState) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap();
  return blockMap.reduce(function (acc, contentBlock) {
    var count = 0;
    contentBlock.findEntityRanges(function (char) {
      var entityKey = char.getEntity();
      return char.getEntity() !== null && contentState.getEntity(entityKey).getType().indexOf('mergeTag') !== -1;
    }, function () {
      count += 1;
    });
    return count + acc;
  }, 0);
};

export default (function (next) {
  return function (bodyState, subjectState, context) {
    var suggestions = next(bodyState, subjectState, context);
    var mergeTagCount = getMergeTagCount(bodyState) + getMergeTagCount(subjectState);

    if (mergeTagCount < MIN_MERGE_TAGS) {
      var title = getSuggestionCopy('personalizationTokenTitle');
      var description = getSuggestionCopy('personalizationTokenDescription');
      var suggestion = createSuggestion(title, description, NORMAL);
      return suggestions.push(suggestion);
    }

    return suggestions;
  };
});