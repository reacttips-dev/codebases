'use es6';

import { ContentState, EditorState, SelectionState } from 'draft-js';
export default (function (blockKey, editorState) {
  var currentContent = editorState.getCurrentContent();

  if (!currentContent.getBlockForKey(blockKey)) {
    return editorState;
  }

  var updatedBlockMap = currentContent.getBlockMap().delete(blockKey);
  var updatedContent = ContentState.createFromBlockArray(updatedBlockMap.toArray());
  var updatedSelection = SelectionState.createEmpty();
  var precedingBlockKey = currentContent.getKeyBefore(blockKey);

  if (precedingBlockKey) {
    var precedingBlock = currentContent.getBlockForKey(precedingBlockKey);
    var offset = precedingBlock ? precedingBlock.getLength() : 0;
    updatedSelection = SelectionState.createEmpty(precedingBlockKey).merge({
      anchorOffset: offset,
      focusOffset: offset
    });
  }

  var updatedEditorState = EditorState.push(editorState, updatedContent, 'remove-range');
  return EditorState.forceSelection(updatedEditorState, updatedSelection);
});