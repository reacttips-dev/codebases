import { EditorState } from 'draft-js';
import { OrderedMap } from 'immutable';

export default function getBlocksInSelection(editorState) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap();
  var selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    return new OrderedMap();
  }

  var startKey = selection.getStartKey();
  var endKey = selection.getEndKey();
  if (startKey === endKey) {
    return new OrderedMap({ startKey: contentState.getBlockForKey(startKey) });
  }
  var blocksUntilEnd = blockMap.takeUntil(function (block, key) {
    return key === endKey;
  });
  return blocksUntilEnd.skipUntil(function (block, key) {
    return key === startKey;
  });
}