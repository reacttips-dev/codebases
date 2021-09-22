import { DISABLED_TYPES } from '../constants';
import { SlateValue, SlateBlock } from '../types';
import { Mark } from 'slate';

const hasParentOfType = (value: SlateValue, type: keyof typeof DISABLED_TYPES): boolean => {
  if (!value.blocks || !value.document) {
    return false;
  }
  return value.blocks.some(
    (block) =>
      !!value.document.getClosest(block.key, (parent) =>
        (DISABLED_TYPES[type] as string[]).includes((parent as SlateBlock).type)
      )
  );
};

const hasInlineOfType = (value: SlateValue, type: keyof typeof DISABLED_TYPES): boolean => {
  if (!value.inlines) {
    return false;
  }
  return value.inlines.some((inline) => {
    return (DISABLED_TYPES[type] as string[]).includes(inline.type);
  });
};

const hasBlockOfType = (value: SlateValue, type: keyof typeof DISABLED_TYPES): boolean => {
  if (!value.blocks) {
    return false;
  }
  return value.blocks.some((block) => {
    return (DISABLED_TYPES[type] as string[]).includes(block.type);
  });
};

export const shouldDisableTool = (value: SlateValue, type: keyof typeof DISABLED_TYPES, isMark = false): boolean => {
  if (!value) {
    return false;
  }

  // disable tool when disabled marks are included
  if (isMark) {
    return value.marks.some((mark: Mark) => (DISABLED_TYPES[type] as string[]).includes(mark.type));
  }

  // disable tool when the current block or inline or a parent block is one of DISABLED_TYPES
  return hasBlockOfType(value, type) || hasInlineOfType(value, type) || hasParentOfType(value, type);
};

export default {
  shouldDisableTool,
};
