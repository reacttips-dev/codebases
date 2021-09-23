'use es6';

import { EditorState, SelectionState, Modifier } from 'draft-js';
export default (function (_ref) {
  var editorState = _ref.editorState,
      contentState = _ref.contentState,
      offset = _ref.offset,
      length = _ref.length;
  var blockKey = editorState.getSelection().getStartKey();
  var replaceSelection = SelectionState.createEmpty(blockKey).merge({
    anchorOffset: offset,
    focusOffset: offset + length,
    isBackward: false,
    hasFocus: true
  });
  var updatedContentState = Modifier.replaceWithFragment(editorState.getCurrentContent(), replaceSelection, contentState.getBlockMap());
  return EditorState.push(editorState, updatedContentState, 'insert-fragment');
});