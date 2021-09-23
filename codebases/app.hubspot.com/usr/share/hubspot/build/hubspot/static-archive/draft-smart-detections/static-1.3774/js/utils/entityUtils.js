'use es6';

import { EditorState, Modifier, SelectionState } from 'draft-js';
export var insertEntity = function insertEntity(editorState, entityKey, text) {
  var selection = editorState.getSelection();
  var modifierMethod = selection.isCollapsed() ? Modifier.insertText : Modifier.replaceText;
  return EditorState.push(editorState, modifierMethod(editorState.getCurrentContent(), selection, text, editorState.getCurrentInlineStyle(), entityKey), 'insert-characters');
};
export var replaceTextWithEntity = function replaceTextWithEntity(editorState, phraseData, entityKey) {
  var _phraseData$toObject = phraseData.toObject(),
      phrase = _phraseData$toObject.phrase,
      offset = _phraseData$toObject.offset,
      blockKey = _phraseData$toObject.blockKey;

  var meetingSelection = SelectionState.createEmpty(blockKey).merge({
    anchorOffset: offset,
    focusOffset: offset + phrase.length
  });
  var editorStateWithSelection = EditorState.forceSelection(editorState, meetingSelection);
  return insertEntity(editorStateWithSelection, entityKey, phrase);
};