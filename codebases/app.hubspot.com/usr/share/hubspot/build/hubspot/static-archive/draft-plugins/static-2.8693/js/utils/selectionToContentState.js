'use es6';

export default (function (editorState, selectionState) {
  if (selectionState === undefined) {
    selectionState = editorState.getSelection();
  }

  var currentContent = editorState.getCurrentContent();
  var startBlockKey = selectionState.getStartKey();
  var startOffset = selectionState.getStartOffset();
  var endBlockKey = selectionState.getEndKey();
  var endOffset = selectionState.getEndOffset();
  var currentBlockMap = currentContent.getBlockMap();
  var newBlocks = currentBlockMap.skipUntil(function (_, blockKey) {
    return blockKey === startBlockKey;
  }).takeUntil(function (_, blockKey) {
    return blockKey === endBlockKey;
  }).set(endBlockKey, currentBlockMap.get(endBlockKey));

  if (startBlockKey === endBlockKey) {
    var targetBlock = newBlocks.get(startBlockKey);
    newBlocks = newBlocks.set(startBlockKey, targetBlock.merge({
      text: targetBlock.getText().slice(startOffset, endOffset),
      characterList: targetBlock.getCharacterList().slice(startOffset, endOffset)
    }));
  } else {
    var startBlock = newBlocks.get(startBlockKey);
    newBlocks = newBlocks.set(startBlockKey, startBlock.merge({
      text: startBlock.getText().slice(startOffset),
      characterList: startBlock.getCharacterList().slice(startOffset)
    }));
    var endBlock = newBlocks.get(endBlockKey);
    newBlocks = newBlocks.set(endBlockKey, endBlock.merge({
      text: endBlock.getText().slice(0, endOffset),
      characterList: endBlock.getCharacterList().slice(0, endOffset)
    }));
  }

  return currentContent.merge({
    blockMap: newBlocks,
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: selectionState.getStartKey(),
      anchorOffset: selectionState.getStartOffset(),
      focusKey: selectionState.getEndKey(),
      focusOffset: selectionState.getEndOffset()
    })
  });
});