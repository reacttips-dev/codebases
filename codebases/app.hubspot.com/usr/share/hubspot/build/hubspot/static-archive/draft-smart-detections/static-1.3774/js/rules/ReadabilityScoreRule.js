'use es6';

import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import EmailAddressRegex from 'PatternValidationJS/regex/EmailAddressRegex';
import UrlRegex from 'PatternValidationJS/regex/UrlRegex';
import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { MAJOR } from './lib/suggestionDegrees';
var MIN_WORD_COUNT = 30;
var MAX_GRADE_LEVEL = 12;
var UNORDERED_LIST_ITEM = 'unordered-list-item';
var ORDERED_LIST_ITEM = 'ordered-list-item';
var ATOMIC = 'atomic';
var regex = ImmutableMap({
  isEmail: EmailAddressRegex,
  isURL: UrlRegex,
  sentences: /[^.!?]+[.!?]+/g,
  endingPuncuation: /\.|!|\?/g,
  allPuncuation: /[.,/#!$%^&*;:{}=\-_`~()]/g,
  complexEndings: /(?:[^laeiouy]es|ed|ly|ing|[^laeiouy]e)$/,
  syllables: /[aeiouy]{1,2}/g,
  colonOrComma: /,|:/g
});

var getSyllableCount = function getSyllableCount(word) {
  var wordLength = word.length;

  if (wordLength === 0) {
    return 0;
  } else if (wordLength <= 3) {
    return 1;
  }

  word = word.replace(regex.get('complexEndings'), '').match(regex.get('syllables'));
  return word !== null ? word.length : 0;
};

var isMatch = function isMatch(regexName, word) {
  var expression = regex.get(regexName);
  var re = new RegExp(expression);
  return re.test(word);
};

export default (function (next) {
  return function (bodyState, subjectState, context) {
    var suggestions = next(bodyState, subjectState, context);
    var blockMap = bodyState.getCurrentContent().getBlockMap();

    if (I18n.locale !== 'en') {
      return suggestions;
    }

    var letterCount = 0;
    var wordCount = 0;
    var sentenceCount = 0;
    var complexWordCount = 0;
    var previousSentenceEnding = '';
    var syllableCount = blockMap.reduce(function (totalSyllableCount, contentBlock) {
      var text = contentBlock.getText().trim().toLowerCase();
      var sentences = text.match(regex.get('sentences'));
      var words = text.replace('-', ' ').split(' ');
      var blockType = contentBlock.getType();
      var sentenceEnding = text.slice(-1);
      var isEmptyLine = text === '';
      var isListWithNoEnding = !isMatch('endingPuncuation', sentenceEnding) && (blockType === UNORDERED_LIST_ITEM || blockType === ORDERED_LIST_ITEM);
      var isPrevSentenceInLetterFormat = isEmptyLine && isMatch('colonOrComma', previousSentenceEnding);
      var countAsSentence = isListWithNoEnding || isPrevSentenceInLetterFormat;

      if (sentences !== null) {
        sentenceCount += sentences.length;
      }

      if (countAsSentence) {
        sentenceCount += 1;
      }

      previousSentenceEnding = sentenceEnding;

      if (isEmptyLine || blockType === ATOMIC) {
        return totalSyllableCount;
      }

      return words.reduce(function (syllableCountAcc, word) {
        var dontCountSyllables = isMatch('isEmail', word) || isMatch('isURL', word) || !isNaN(word);

        if (dontCountSyllables) {
          return syllableCountAcc;
        }

        var wordRemovePuncuation = word.replace(regex.get('allPuncuation'), '');
        var syllablesCount = getSyllableCount(wordRemovePuncuation);

        if (syllablesCount >= 3) {
          complexWordCount += 1;
        }

        wordCount += 1;
        letterCount += wordRemovePuncuation.length;
        return syllableCountAcc + syllablesCount;
      }, totalSyllableCount);
    }, 0);

    if (!isMatch('endingPuncuation', previousSentenceEnding)) {
      sentenceCount += 1;
    }

    if (sentenceCount === 0) {
      sentenceCount = 1;
    }

    if (wordCount === 0) {
      wordCount = 1;
    } // Flesch-Kincaid: https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests
    // Gunning fog index: https://en.wikipedia.org/wiki/Gunning_fog_index
    // Automated readability index: https://en.wikipedia.org/wiki/Automated_readability_index


    var fleschKincaidGrade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
    var gunningFog = 0.4 * (wordCount / sentenceCount + 100 * (complexWordCount / wordCount));
    var automatedReadability = 4.71 * (letterCount / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;
    var averageGrade = (fleschKincaidGrade + gunningFog + automatedReadability) / 3;

    if (wordCount > MIN_WORD_COUNT && averageGrade > MAX_GRADE_LEVEL) {
      var title = getSuggestionCopy('readabilityScoreTitle');
      var description = getSuggestionCopy('readabilityScoreDescription');
      var suggestion = createSuggestion(title, description, MAJOR);
      return suggestions.push(suggestion);
    }

    return suggestions;
  };
});