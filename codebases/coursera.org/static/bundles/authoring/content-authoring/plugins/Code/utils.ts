import Immutable from 'immutable';
import { CodeBlockOptions } from 'bundles/cml/types/Content';
import { BLOCK_TYPES } from '../../constants';
import { SlateChange, SlateValue, SlateBlock } from '../../types';

/**
 * Handles uploading and adding new code block to content
 */
function insertCode(
  language: string,
  codeBlockOptions: CodeBlockOptions | undefined,
  change: SlateChange,
  callback?: (change: SlateChange) => void
) {
  if (callback) {
    callback(
      change
        .insertBlock({
          type: BLOCK_TYPES.CODE,
          data: Immutable.fromJS({
            attributes: {
              language,
              codeBlockOptions,
            },
          }),
        })
        .insertBlock(BLOCK_TYPES.PARAGRAPH)
        .focus()
    );
  }
}

export const codeStrategy = (
  language: string,
  codeBlockOptions: CodeBlockOptions | undefined,
  change: SlateChange,
  callback?: (change: SlateChange) => void
) => {
  insertCode(language, codeBlockOptions, change, callback);
};

export const hasCode = (value: SlateValue) =>
  value && value.blocks.some((block: SlateBlock) => block.type === BLOCK_TYPES.CODE);
