import { createLazyOrchestrator } from 'owa-bundling';
import { navigateToTopOfListView } from '../utils/navigateToTopOfListView';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';

export const scrollToTopOfListViewOrchestrator = createLazyOrchestrator(
    onSelectFolderComplete,
    'onSelectFolderComplete',
    actionMessage => {
        navigateToTopOfListView(
            actionMessage.selectedTableViewId,
            actionMessage.mailListItemSelectionSource,
            actionMessage.selectedFolderId === actionMessage.previousFolderId &&
                actionMessage.actionSource === 'FolderNodeClick', // make sure the source of the click is from a folder node from the left nav.
            actionMessage.isInImmersiveView
        );
    }
);
