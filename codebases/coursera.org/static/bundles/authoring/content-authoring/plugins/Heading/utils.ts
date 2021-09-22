import Immutable from 'immutable';
import { SlateValue, SlateChange } from '../../types';

export const hasHeadingByLevel = (value: SlateValue, level: string): boolean => {
  return value.blocks.some((block) => {
    const blockLevel =
      block.data.getIn(['attributes', 'level']) ||
      (block.data.get('attributes') ? block.data.get('attributes').level : null);
    return block.type === 'heading' && blockLevel === level;
  });
};

export const headingStrategy = (change: SlateChange, level: string): SlateChange => {
  if (hasHeadingByLevel(change.value, level)) {
    // remove heading, convert to paragraph and set focus
    change.setBlocks('paragraph').focus();
  } else {
    // add new heading and set focus
    change
      .setBlocks({
        type: 'heading',
        data: Immutable.fromJS({
          attributes: {
            level,
          },
        }),
      })
      .focus();
  }

  return change;
};
