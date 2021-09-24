'use es6';

export default (function (editorState) {
  var selection = editorState.getSelection();
  var currentContent = editorState.getCurrentContent();
  var currentBlockKey = selection.get('anchorKey');
  var currentBlock = currentContent.getBlockForKey(currentBlockKey);
  return currentBlock && currentBlock.getType() === 'atomic';
});