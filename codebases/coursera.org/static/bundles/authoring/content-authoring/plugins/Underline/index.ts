import isKeyHotkey from 'is-hotkey';
import Underline from './Underline';
import UnderlineUtils, { underlineMarkStrategy } from './utils';
import UnderlineButton from './UnderlineButton';
import { MARKS } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { SlateChange } from '../../types';

// keyboard shortcuts for text formatting
const isUnderlineHotkey = isKeyHotkey('mod+u');

const underlineKeyboardShortcut = (event: KeyboardEvent, change: SlateChange): SlateChange | undefined => {
  if (isUnderlineHotkey(event) && !shouldDisableTool(change.value, MARKS.UNDERLINE, true)) {
    return underlineMarkStrategy(change);
  }
};
const underlinePlugin = () => ({
  onKeyDown(...args: [KeyboardEvent, SlateChange]) {
    return underlineKeyboardShortcut(args[0], args[1]);
  },
});

const exported = {
  underlinePlugin,
  Underline,
  underlineKeyboardShortcut,
  UnderlineUtils,
  UnderlineButton,
};

export default exported;
export { underlinePlugin, Underline, underlineKeyboardShortcut, UnderlineUtils, UnderlineButton };
