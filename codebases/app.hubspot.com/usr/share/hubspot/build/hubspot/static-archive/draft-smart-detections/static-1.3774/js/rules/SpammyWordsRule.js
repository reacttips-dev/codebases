'use es6';

import { Set as ImmutableSet } from 'immutable';
import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL } from './lib/suggestionDegrees';
import { getSpammyWords, getSpammyPhrases } from './lib/phrases';

var getSpammyWordsFromEditorState = function getSpammyWordsFromEditorState(editorState) {
  var blockMap = editorState.getCurrentContent().getBlockMap();
  return blockMap.reduce(function (_spammyWordsSet, contentBlock) {
    var text = contentBlock.getText().trim().toLowerCase();
    var words = text.split(' ');
    var spammyWordsSet = words.reduce(function (updatedSpammyWordsSet, word) {
      if (getSpammyWords().has(word)) {
        return updatedSpammyWordsSet.add(word);
      }

      return updatedSpammyWordsSet;
    }, _spammyWordsSet);
    return getSpammyPhrases().reduce(function (updatedSpammyWordsSet, phrase) {
      if (text.indexOf(phrase) !== -1) {
        return updatedSpammyWordsSet.add(phrase);
      }

      return updatedSpammyWordsSet;
    }, spammyWordsSet);
  }, ImmutableSet());
};

export default (function (next) {
  return function (bodyState, subjectState, context) {
    var suggestions = next(bodyState, subjectState, context);
    var spammyWords = getSpammyWordsFromEditorState(subjectState);

    if (spammyWords.size > 0) {
      var spammyWordList = spammyWords.map(function (word) {
        return "\"" + word + "\"";
      }).toArray().join(', ');
      var count = spammyWords.size;
      var title = getSuggestionCopy('spammyWordTitle');
      var description = getSuggestionCopy('spammyWordDescription', {
        spammyWordList: spammyWordList,
        count: count
      });
      var suggestion = createSuggestion(title, description, NORMAL);
      return suggestions.push(suggestion);
    }

    return suggestions;
  };
});