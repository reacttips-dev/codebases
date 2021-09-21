import { BLOCK_TYPE } from 'draft-js-utils';

export default function isListItem(block) {
  var blockType = block.getType();
  return blockType === BLOCK_TYPE.UNORDERED_LIST_ITEM || blockType === BLOCK_TYPE.ORDERED_LIST_ITEM;
}