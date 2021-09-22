import type { ActionSource } from 'owa-analytics-types';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import * as undoActions from 'owa-mail-undo';

export default function onUndo(actionSource: ActionSource) {
    undoActions.lazyUndo.importAndExecute(actionSource);
    lazyResetFocus.importAndExecute();
}
