import isHotKey from 'is-hotkey';
import Variable from './Variable';
import VarUtils, { variableMarkStrategy } from './utils';
import VariableButton from './VariableButton';
import { MARKS } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import type { SlateChange } from '../../types';

// keyboard shortcuts for text formatting
const isVariableHotkey = isHotKey('`');

// eslint note: returning any value other than undefined messes up typing
/* eslint-disable consistent-return */
const variableKeyboardShortcut = (event: KeyboardEvent, change: SlateChange): SlateChange | undefined => {
  // handle disabling shortcuts for DISABLED_TYPES
  if (isVariableHotkey(event) && !shouldDisableTool(change.value, MARKS.VARIABLE, true)) {
    event.preventDefault();
    return variableMarkStrategy(change);
  }
};

const variablePlugin = () => ({
  onKeyDown(...args: [KeyboardEvent, SlateChange]) {
    return variableKeyboardShortcut(args[0], args[1]);
  },
});

export default {
  variablePlugin,
  Variable,
  variableKeyboardShortcut,
  VarUtils,
  VariableButton,
};

export { variablePlugin, Variable, isVariableHotkey, variableKeyboardShortcut, VarUtils, VariableButton };
