import closeImmersiveReadingPane from 'owa-mail-actions/lib/closeImmersiveReadingPane';
import { lazyTrySaveAndCloseCompose } from 'owa-mail-compose-actions';
import { composeStore } from 'owa-mail-compose-store';
import { isImmersiveReadingPaneShown } from 'owa-mail-layout/lib/selectors/isImmersiveReadingPaneShown';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { isDeepLink } from 'owa-url';

/**
 * Called when user tries to select a folder
 * @param state the state which contains the reading pane position
 */
export default function onSelectingFolder() {
    // VSO 14710: [Refactor][MMO] SelectFolder -> Compose-store decoupling
    // Temporary fix 55262: don't close compose popout in popout window
    // In popout window, ideally we should not select any folder.
    // But even folder selection happens, we should not close compose
    if (composeStore.primaryComposeId !== null && !isDeepLink()) {
        lazyTrySaveAndCloseCompose.importAndExecute(null /*viewState*/);
    } else if (isReadingPanePositionOff() && isImmersiveReadingPaneShown()) {
        // Close the reading pane if user is in single line view
        closeImmersiveReadingPane('FolderNodeClick');
    }
}
