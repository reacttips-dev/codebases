'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import memoize from 'transmute/memoize';
import createCustomDocumentLinkRegex from 'draft-plugins/lib/createCustomDocumentLinkRegex';
import { EditorState } from 'draft-js';
import { MEETINGS_LINK_ENTITY_TYPE } from 'draft-plugins/lib/constants';
import entityPhraseDetection from 'draft-smart-detections/utils/entityPhraseDetection';
import { replaceTextWithEntity } from 'draft-smart-detections/utils/entityUtils';
import { getMeetingPhrases } from 'draft-smart-detections/rules/lib/phrases';
import createMeetingProTipEntityOptions from 'draft-plugins/utils/createMeetingProTipEntityOptions';
export var hasDoubleBraces = memoize(function (contentState) {
  var plainText = contentState.getPlainText();
  var isCustomDocumentLink = createCustomDocumentLinkRegex().test(plainText);

  var _hasDoubleBraces = plainText.indexOf('{{') !== -1 || plainText.indexOf('}}') !== -1;

  return !isCustomDocumentLink && _hasDoubleBraces;
});
export var hasTripleBracesInHTML = function hasTripleBracesInHTML(html) {
  // Triple open brackets cause template renders to fail - https://issues.hubspotcentral.com/browse/SCONTENT-2140
  return html.indexOf('{{{') !== -1 || html.indexOf('}}}') !== -1;
}; // Tries to show the 'Turn "...meeting..." into a meeting link' popover

export var updateEditorStateWithMeetingsPopover = function updateEditorStateWithMeetingsPopover(bodyState) {
  var _bodyState$getCurrent;

  var meetingPhrase = entityPhraseDetection(bodyState, getMeetingPhrases(), MEETINGS_LINK_ENTITY_TYPE);

  if (!meetingPhrase) {
    return null;
  }

  var _meetingPhrase$toObje = meetingPhrase.toObject(),
      phrase = _meetingPhrase$toObje.phrase,
      offset = _meetingPhrase$toObje.offset,
      blockKey = _meetingPhrase$toObje.blockKey;

  var entityOptions = createMeetingProTipEntityOptions(phrase, offset, blockKey);

  var contentStateWithEntity = (_bodyState$getCurrent = bodyState.getCurrentContent()).createEntity.apply(_bodyState$getCurrent, _toConsumableArray(entityOptions));

  var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  var editorStateWithMeeting = replaceTextWithEntity(EditorState.set(bodyState, {
    currentContent: contentStateWithEntity
  }), meetingPhrase, entityKey);
  return editorStateWithMeeting;
};