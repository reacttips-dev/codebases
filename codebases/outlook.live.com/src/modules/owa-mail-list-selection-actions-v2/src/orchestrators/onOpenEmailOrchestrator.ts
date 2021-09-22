import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import { orchestrator } from 'satcheljs';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import getItemIdForMailList from 'owa-mail-store/lib/selectors/getItemIdForMailList';
import { default as onOpenEmail } from 'owa-mail-actions/lib/onOpenEmail';
import { listViewStore } from 'owa-mail-list-store';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';

// Orchestrator to open email on keyboard input for both item parts and items
orchestrator(onOpenEmail, actionMessage => {
    const {
        tableView,
        selectedNodeIds,
        selectedRowKeys,
        mailListItemSelectionSource,
    } = actionMessage;

    // If there is an expanded conversation, open email to selected item part or thread (if first level expansion)
    if (
        selectedNodeIds.length > 0 &&
        mailListItemSelectionSource === MailListItemSelectionSource.KeyboardEnter
    ) {
        // Only support open email to a single item.
        if (selectedNodeIds.length !== 1) {
            return;
        }

        mailListSelectionActionsV2.itemPartSelected(
            selectedNodeIds[0],
            getItemIdForMailList(selectedNodeIds[0], isFirstLevelExpanded(selectedRowKeys[0])),
            listViewStore.expandedConversationViewState.allNodeIds,
            tableView,
            mailListItemSelectionSource
        );
        // If no expanded conversation, open email on selected row
    } else {
        // Only support open email to a single row.
        if (selectedRowKeys.length !== 1) {
            return;
        }

        mailListSelectionActionsV2.singleSelectRow(
            tableView,
            selectedRowKeys[0],
            true /* isUserNavigation */,
            mailListItemSelectionSource
        );
    }
});
