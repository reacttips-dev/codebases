import { EditorState } from 'draft-js';

export default function changeBlockType(editorState, blockKey, newType) {
  var content = editorState.getCurrentContent();
  var block = content.getBlockForKey(blockKey);
  var type = block.getType();
  if (type === newType) {
    return editorState;
  }
  var newBlock = block.set('type', newType);
  var newContent = content.merge({
    blockMap: content.getBlockMap().set(blockKey, newBlock)
  });
  return EditorState.push(editorState, newContent, 'change-block-type');
}