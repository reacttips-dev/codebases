'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import entityPhraseDetection from 'draft-smart-detections/utils/entityPhraseDetection';
import { getDocumentsPhrases } from './lib/phrases';
import createRule from './lib/createRule';
import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL } from './lib/suggestionDegrees';
import DocumentsLinkRuleDescription from './components/DocumentsLinkRuleDescription';
export default (function (_ref) {
  var fetchDecks = _ref.fetchDecks,
      documentLinkEntityType = _ref.documentLinkEntityType;
  var title = getSuggestionCopy('documentLinkTitle');

  var descriptionZeroState = /*#__PURE__*/_jsx(DocumentsLinkRuleDescription, {});

  var suggestionZeroState = createSuggestion(title, descriptionZeroState, NORMAL);
  var deps = {
    decks: function decks(done) {
      fetchDecks().then(function (decks) {
        done(decks);
      });
    }
  };

  var rule = function rule(next) {
    return function (bodyState, subjectState, context) {
      var suggestions = next(bodyState, subjectState, context);
      var description = I18n.text('draftSmartDetections.suggestions.rules.documentLinkDescription.includeADocument');
      var suggestion = createSuggestion(title, description, NORMAL);

      if (context.decks) {
        var detectedPhrases = entityPhraseDetection(bodyState, getDocumentsPhrases(), documentLinkEntityType);

        if (detectedPhrases !== null) {
          return context.decks.get('results').isEmpty() ? suggestions.push(suggestionZeroState) : suggestions.push(suggestion);
        }
      }

      return suggestions;
    };
  };

  return createRule({
    rule: rule,
    deps: deps
  });
});