import isKeyHotkey from 'is-hotkey';
import { linkStrategy, hasLink } from './utils';
import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';

import LinkButton from './LinkButton';
import UnlinkButton from './UnlinkButton';
import { SlateChange } from '../../types';

// keyboard shortcuts for text formatting
const isLinkHotkey = isKeyHotkey('mod+k');

const linkKeyboardShortcut = (event: KeyboardEvent, change: SlateChange): SlateChange | undefined => {
  if (isLinkHotkey(event) && !shouldDisableTool(change.value, BLOCK_TYPES.LINK)) {
    return linkStrategy(change);
  }
};

const linkPlugin = () => ({
  onKeyDown(...args: [KeyboardEvent, SlateChange]) {
    return linkKeyboardShortcut(args[0], args[1]);
  },
});

const exported = {
  LinkButton,
  UnlinkButton,
  linkPlugin,
  hasLink,
};

export default exported;
export { LinkButton, UnlinkButton, linkPlugin, hasLink };
