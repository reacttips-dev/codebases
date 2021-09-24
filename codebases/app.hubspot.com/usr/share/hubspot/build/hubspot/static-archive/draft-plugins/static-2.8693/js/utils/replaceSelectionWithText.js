'use es6';

import { EditorState, SelectionState, Modifier } from 'draft-js';
import { replaceSelectionChangeTypes } from 'draft-plugins/lib/constants';
var PUSH = replaceSelectionChangeTypes.PUSH,
    SET = replaceSelectionChangeTypes.SET;
export default (function (_ref) {
  var editorState = _ref.editorState,
      text = _ref.text,
      start = _ref.start,
      end = _ref.end,
      entityKey = _ref.entityKey,
      _ref$inlineStyles = _ref.inlineStyles,
      inlineStyles = _ref$inlineStyles === void 0 ? null : _ref$inlineStyles,
      blockKey = _ref.blockKey,
      _ref$changeType = _ref.changeType,
      changeType = _ref$changeType === void 0 ? PUSH : _ref$changeType;
  var userSelection = editorState.getSelection();
  var selectedBlockKey = blockKey || userSelection.getStartKey();
  var replaceSelection = SelectionState.createEmpty(selectedBlockKey).merge({
    anchorOffset: start,
    focusOffset: end,
    isBackward: false,
    hasFocus: true
  });
  var contentState = Modifier.replaceText(editorState.getCurrentContent(), replaceSelection, text, inlineStyles, entityKey);
  var resultEditorState = editorState;

  switch (changeType) {
    case PUSH:
      resultEditorState = EditorState.push(editorState, contentState, 'insert-characters');
      break;

    case SET:
      resultEditorState = EditorState.set(editorState, {
        currentContent: contentState
      });
      break;

    default:
      resultEditorState = editorState;
      break;
  }

  var needToUpdateSelection = userSelection.getStartKey() === selectedBlockKey && userSelection.isCollapsed() && userSelection.getStartOffset() >= end;

  if (needToUpdateSelection) {
    var delta = text.length - (end - start);

    if (delta !== 0) {
      var newUserSelection = userSelection.update('anchorOffset', function (anchorOffset) {
        return anchorOffset + delta;
      }).update('focusOffset', function (focusOffset) {
        return focusOffset + delta;
      });
      resultEditorState = EditorState.acceptSelection(resultEditorState, newUserSelection);
    }
  }

  return resultEditorState;
});