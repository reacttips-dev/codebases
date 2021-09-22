import isKeyHotkey from 'is-hotkey';
import Italic from './Italic';
import ItalicButton from './ItalicButton';
import ItalicUtils, { italicMarkStrategy } from './utils';
import { MARKS } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { SlateChange } from '../../types';

// keyboard shortcuts for text formatting
const isItalicHotkey = isKeyHotkey('mod+i');

const italicKeyboardShortcut = (event: KeyboardEvent, change: SlateChange) => {
  if (isItalicHotkey(event) && !shouldDisableTool(change.value, MARKS.ITALIC, true)) {
    return italicMarkStrategy(change);
  }
};
const italicPlugin = () => ({
  onKeyDown(...args: [KeyboardEvent, SlateChange]) {
    return italicKeyboardShortcut(args[0], args[1]);
  },
});

const exported = {
  italicPlugin,
  Italic,
  italicKeyboardShortcut,
  ItalicUtils,
  ItalicButton,
};

export default exported;
export { italicPlugin, Italic, italicKeyboardShortcut, ItalicUtils, ItalicButton };
