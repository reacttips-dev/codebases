import isKeyHotkey from 'is-hotkey';
import Bold from './Bold';
import BoldUtils, { boldMarkStrategy } from './utils';
import BoldButton from './BoldButton';
import type { Props as BoldButtonProps } from './BoldButton';
import { MARKS } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { SlateChange } from '../../types';

// keyboard shortcuts for text formatting
const isBoldHotkey = isKeyHotkey('mod+b');

const boldKeyboardShortcut = (event: KeyboardEvent, change: SlateChange) => {
  // handle disabling shortcuts for DISABLED_TYPES
  if (isBoldHotkey(event) && !shouldDisableTool(change.value, MARKS.BOLD, true)) {
    return boldMarkStrategy(change);
  }
};

const boldPlugin = () => ({
  onKeyDown(...args: [KeyboardEvent, SlateChange]) {
    return boldKeyboardShortcut(args[0], args[1]);
  },
});

export default {
  boldPlugin,
  Bold,
  boldKeyboardShortcut,
  BoldUtils,
  BoldButton,
};

export { boldPlugin, Bold, boldKeyboardShortcut, BoldUtils, BoldButton };
export type { BoldButtonProps };
