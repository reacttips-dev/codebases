import type { KeydownConfig } from 'owa-hotkeys';
import { getCommands } from '../utils/MailModuleHotKeys';
import { isAnySxSDisplayedInMainWindow } from 'owa-sxs-store';
import * as undoActions from 'owa-mail-undo';

export function setupUndoHotKeys(): KeydownConfig[] {
    return [{ command: getCommands().undoAction, handler: undoAction }];
}

function undoAction() {
    // do nothing if SxS is showing
    if (!isAnySxSDisplayedInMainWindow()) {
        undoActions.lazyUndo.importAndExecute('Keyboard');
    }
}
