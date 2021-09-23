'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import { getMeetingPhrases } from './lib/phrases';
import entityPhraseDetection from 'draft-smart-detections/utils/entityPhraseDetection';
import createRule from './lib/createRule';
import createSuggestion from './lib/createSuggestion';
import getSuggestionCopy from './lib/getSuggestionCopy';
import { NORMAL } from './lib/suggestionDegrees';
import MeetingsLinkRuleDescription from './components/MeetingsLinkRuleDescription';
var _currentlyFetching = false;
export default (function (_ref) {
  var fetchMeetings = _ref.fetchMeetings,
      hasSalesPro = _ref.hasSalesPro,
      meetingLinkEntityType = _ref.meetingLinkEntityType;
  var title = getSuggestionCopy('meetingsLinkTitle');

  var descriptionZeroState = /*#__PURE__*/_jsx(MeetingsLinkRuleDescription, {});

  var suggestionZeroState = createSuggestion(title, descriptionZeroState, NORMAL);
  var deps = {
    meetings: function meetings(done) {
      if (_currentlyFetching === true) {
        return;
      }

      _currentlyFetching = true;
      fetchMeetings().then(function (meetings) {
        done(meetings);
      }, function (err) {
        if (err.status === 404) {
          done(null);
          return;
        }

        throw err;
      }).finally(function () {
        _currentlyFetching = false;
      });
    }
  };

  var rule = function rule(next) {
    return function (bodyState, subjectState, context) {
      var description = I18n.text('draftSmartDetections.suggestions.rules.meetingsLinkDescription.settingUpAMeeting');
      var suggestion = createSuggestion(title, description, NORMAL);
      var suggestions = next(bodyState, subjectState, context);

      if (hasSalesPro()) {
        var detectedPhrases = entityPhraseDetection(bodyState, getMeetingPhrases(), meetingLinkEntityType);

        if (detectedPhrases !== null) {
          return context.meetings ? suggestions.push(suggestion) : suggestions.push(suggestionZeroState);
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