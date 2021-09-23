'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { EditorState, Modifier, ContentBlock, BlockMapBuilder, genKey } from 'draft-js';

var getEmptyBlock = function getEmptyBlock() {
  return new ContentBlock({
    key: genKey(),
    type: 'unstyled',
    text: '',
    characterList: List()
  });
};

export default function insertAtomicBlockWithData(editorState, blockData) {
  var preserveSelection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var prependWithEmptyBlock = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var typeOverride = arguments.length > 4 ? arguments[4] : undefined;
  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();
  var afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');
  var targetSelection = afterRemoval.getSelectionAfter();
  var afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
  var insertionTarget = afterSplit.getSelectionAfter();
  var asType = Modifier.setBlockType(afterSplit, insertionTarget, 'atomic');
  var fragmentArray = [new ContentBlock({
    key: genKey(),
    type: typeOverride || 'atomic',
    text: '',
    characterList: List(),
    data: ImmutableMap(blockData)
  }), getEmptyBlock()];

  if (prependWithEmptyBlock) {
    fragmentArray.unshift(getEmptyBlock());
  }

  var fragment = BlockMapBuilder.createFromArray(fragmentArray);
  var withBlock = Modifier.replaceWithFragment(asType, insertionTarget, fragment);
  var newSelection = preserveSelection ? selectionState : withBlock.getSelectionAfter().set('hasFocus', true);
  var newContent = withBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: newSelection
  });
  return EditorState.forceSelection(EditorState.push(editorState, newContent, 'insert-fragment'), newContent.getSelectionAfter());
}