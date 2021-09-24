'use es6';

export default (function (editorState) {
  var selection = editorState.getSelection();
  var currentContent = editorState.getCurrentContent();
  var selectionEndOffset = selection.getEndOffset();
  var selectionEndBlockKey = selection.getEndKey();
  var lineEndOffset = currentContent.getBlockForKey(selectionEndBlockKey).getLength();
  return selectionEndOffset === lineEndOffset;
});