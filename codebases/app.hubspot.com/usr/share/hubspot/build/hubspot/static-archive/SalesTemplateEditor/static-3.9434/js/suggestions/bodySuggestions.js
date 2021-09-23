'use es6';

import { fromJS } from 'immutable';
import { fetchMeetingsLinks } from 'draft-plugins/api/MeetingsApi';
import DeckApi from 'SalesTemplateEditor/api/DeckApi';
import { hasSalesPro } from 'SalesTemplateEditor/lib/permissions';
import { MEETINGS_LINK_ENTITY_TYPE, DOCUMENT_CONSTANTS } from 'draft-plugins/lib/constants';
import composeRules from 'draft-smart-detections/composeRules';
import SuggestionGroup from 'draft-smart-detections/SuggestionGroup';
import BodyWordCountRule from 'draft-smart-detections/rules/BodyWordCountRule';
import QuestionCountRule from 'draft-smart-detections/rules/QuestionCountRule';
import MeetingsLinkRule from 'draft-smart-detections/rules/MeetingsLinkRule';
import DocumentsLinkRule from 'draft-smart-detections/rules/DocumentsLinkRule';
import ReadabilityScoreRule from 'draft-smart-detections/rules/ReadabilityScoreRule';
export default composeRules(SuggestionGroup(QuestionCountRule, MeetingsLinkRule({
  hasSalesPro: hasSalesPro,
  meetingLinkEntityType: MEETINGS_LINK_ENTITY_TYPE,
  fetchMeetings: function fetchMeetings() {
    return fetchMeetingsLinks().then(fromJS);
  }
}), DocumentsLinkRule({
  documentLinkEntityType: DOCUMENT_CONSTANTS.DOCUMENTS_LINK_ENTITY_TYPE,
  fetchDecks: DeckApi.fetch
}), ReadabilityScoreRule, BodyWordCountRule));