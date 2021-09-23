'use es6';

import { EditorState, Modifier, SelectionState } from 'draft-js';
export default (function (_ref) {
  var editorState = _ref.editorState,
      block = _ref.block,
      updatedBlockData = _ref.updatedBlockData,
      _ref$preserveSelectio = _ref.preserveSelection,
      preserveSelection = _ref$preserveSelectio === void 0 ? false : _ref$preserveSelectio;
  var blockSelection = SelectionState.createEmpty(block.getKey());
  var contentWithModifiedBlockData = Modifier.mergeBlockData(editorState.getCurrentContent(), blockSelection, updatedBlockData);

  if (preserveSelection) {
    // we preserve selection when doing something "under the hood", i.e. a user
    // didn't manually update block data, so we shouldn't select the block or
    // add the changes to the undo stack (hence EditorState.set instead of .push)
    var originalContent = editorState.getCurrentContent();
    contentWithModifiedBlockData = contentWithModifiedBlockData.merge({
      selectionAfter: originalContent.getSelectionAfter(),
      selectionBefore: originalContent.getSelectionBefore()
    });
    return EditorState.set(editorState, {
      currentContent: contentWithModifiedBlockData
    });
  }

  return EditorState.push(editorState, contentWithModifiedBlockData, 'change-block-data');
});