// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EditList from 'slate-edit-list';
import { BLOCK_TYPES } from '../../constants';
import { SlateValue, SlateChange, SlateBlock } from '../../types';

const { BULLET_LIST, NUMBER_LIST, LIST_ITEM, PARAGRAPH } = BLOCK_TYPES;

// eslint-disable-next-line new-cap
const listPlugin = EditList({
  types: [BULLET_LIST, NUMBER_LIST],
  typeItem: LIST_ITEM,
  typeDefault: PARAGRAPH,
});

const { isSelectionInList } = listPlugin.utils;
const { wrapInList } = listPlugin.changes;

const hasParentOfType = (value: SlateValue, type: string): boolean =>
  value &&
  value.blocks.some(
    (block) => !!value.document.getClosest(block.key, (parent) => (parent as SlateBlock).type === type)
  );

const isSelectionInListByType = (value: SlateValue, type: string): boolean => {
  return hasParentOfType(value, type);
};

const removeListByType = (change: SlateChange, type: string): SlateChange =>
  // skip our schema normalization with `withoutNormalization`
  // since we temporarily violate the EDITOR_SCHEMA when converting a selection
  // from a list back to `PARAGRAPH`
  change.withoutNormalization((c: SlateChange) =>
    c.unwrapBlock(LIST_ITEM).setBlocks(PARAGRAPH).unwrapBlock(type).focus()
  );

const exported = {
  isSelectionInList,
  isSelectionInListByType,

  listStrategy: (change: SlateChange, type: string): SlateChange => {
    // replace types for existing lists
    if (type === NUMBER_LIST && isSelectionInListByType(change.value, BULLET_LIST)) {
      return change.unwrapBlock(BULLET_LIST).wrapBlock(NUMBER_LIST).focus();
    } else if (type === BULLET_LIST && isSelectionInListByType(change.value, NUMBER_LIST)) {
      return change.unwrapBlock(NUMBER_LIST).wrapBlock(BULLET_LIST).focus();
    }

    // remove list
    if (isSelectionInListByType(change.value, type)) {
      return removeListByType(change, type).focus();
    }

    if (change.value.blocks.size > 1) {
      // skip our schema normalization with `withoutNormalization`
      // since we temporarily violate the EDITOR_SCHEMA when converting a selection
      // to wrap in list
      return change.withoutNormalization((c) => {
        return wrapInList(c.setBlocks(LIST_ITEM), type).focus();
      });
    }

    // create new list
    return wrapInList(change, type).focus();
  },
};

export default exported;
export { isSelectionInList, isSelectionInListByType };

export const { listStrategy } = exported;
