import { orchestrator } from 'satcheljs';
import { openNotesFolder } from 'owa-whats-new/lib/actions/openNotesFolder';
import selectFolderWithFallbackInFolderForest from '../actions/selectFolderWithFallbackInFolderForest';
import type { ActionSource } from 'owa-mail-store';

export default orchestrator(openNotesFolder, actionMessage => {
    selectFolderWithFallbackInFolderForest('notes', actionMessage.actionSource as ActionSource);
});
