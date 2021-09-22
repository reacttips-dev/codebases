import onSelectingFolder from './onSelectingFolder';
import * as undoActions from 'owa-mail-undo';
import type { ActionSource } from 'owa-mail-store';
import { lazyEndSearchSession } from 'owa-search-actions/lib/lazyFunctions';
import getScenarioStore from 'owa-search-store/lib/selectors/getScenarioStore';
import { SearchScenarioId } from 'owa-search-store/lib/store/schema/SearchScenarioId';
import { lazyClearNotificationBar } from 'owa-notification-bar';
import { shouldShowFolderPaneAsOverlay } from 'owa-mail-layout/lib/selectors/shouldShowFolderPaneAsOverlay';
import { shouldShowFolderPane } from 'owa-mail-layout/lib/selectors/shouldShowFolderPane';
import { setShowFolderPane } from 'owa-mail-layout/lib/actions/setShowFolderPane';

/**
 * Called after a node (Folder, Persona, Group) is selected in the folder forest
 */
export default async function onAfterSelectingNode(actionSource?: ActionSource) {
    await undoActions.clearLastUndoableAction();
    lazyClearNotificationBar.import().then(clearNotificationBar => {
        clearNotificationBar('MailModuleNotificationBarHost');
    });

    /**
     * If user is in search session, it should be ended (disregarding usual
     * conditions we check when search box is blurred).
     */
    if (getScenarioStore(SearchScenarioId.Mail).searchSessionGuid) {
        const endSearchSession = await lazyEndSearchSession.import();
        endSearchSession(SearchScenarioId.Mail, actionSource);
    }

    /**
     * Hide overlay folder pane when a node is selected in left pane
     */
    if (shouldShowFolderPane() && shouldShowFolderPaneAsOverlay()) {
        setShowFolderPane(false);
    }

    onSelectingFolder();
}
