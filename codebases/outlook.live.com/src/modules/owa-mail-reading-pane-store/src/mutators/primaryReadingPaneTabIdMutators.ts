import store from '../store/Store';
import type { ClientItemId } from 'owa-client-ids';
import { mutatorAction, mutator } from 'satcheljs';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';

export const updatePrimaryReadingPaneTabId = mutatorAction(
    'updatePrimaryReadingPaneTabId',
    function (id: ClientItemId) {
        store.primaryReadingPaneTabId = id;
    }
);

mutator(onSelectFolderComplete, actionMessage => {
    store.primaryReadingPaneTabId = null;
});
