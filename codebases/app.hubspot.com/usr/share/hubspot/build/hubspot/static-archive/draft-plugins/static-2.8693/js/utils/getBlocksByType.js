'use es6';

export default (function (_ref) {
  var editorState = _ref.editorState,
      blockType = _ref.blockType,
      atomicType = _ref.atomicType;
  var contentState = editorState.getCurrentContent();
  var blockArray = contentState.getBlocksAsArray();
  return blockArray.filter(function (block) {
    var containsBlockType = block.getType() === blockType;
    var containsAtomicType = !atomicType || block.getData().get('atomicType') === atomicType;
    return containsBlockType && containsAtomicType;
  });
});