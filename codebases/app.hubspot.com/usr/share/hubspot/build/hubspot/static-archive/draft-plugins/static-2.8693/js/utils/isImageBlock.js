'use es6';

export default (function (contentBlock) {
  var blockType = contentBlock.getType();
  var atomicType = contentBlock.getData().get('atomicType');
  return blockType === 'atomic' && atomicType === 'IMAGE';
});