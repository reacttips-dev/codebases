import type { KeydownConfig } from 'owa-hotkeys';
import { listViewStore } from 'owa-mail-list-store';
import {
    keyboardCollapseConversation,
    singleSelectRow,
} from 'owa-mail-actions/lib/mailListSelectionActions';
import { isSecondLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';

export function setupMailListItemContainerKeys(props: {
    mailListTableProps: { tableViewId: string };
    mailListItemDataProps: { rowKey: string; shouldShowTwisty: boolean };
}): KeydownConfig[] {
    const keys = [];

    keys.push(
        {
            command: 'left',
            handler: () => keyboardCollapseConversation(props.mailListItemDataProps.rowKey),
        },
        {
            command: 'right',
            handler: () =>
                expandMailListItem(
                    props.mailListItemDataProps.shouldShowTwisty,
                    props.mailListItemDataProps.rowKey,
                    props.mailListTableProps.tableViewId
                ),
        }
    );

    return keys;
}

// TODO update for two level expansion
function expandMailListItem(shouldShowTwisty: boolean, rowKey: string, tableViewId: string) {
    if (!shouldShowTwisty || isSecondLevelExpanded(rowKey)) {
        // no item part to expand or the conversation is already expanded
        return;
    }

    // perform the same action as clicking on the twisty
    singleSelectRow(
        listViewStore.tableViews.get(tableViewId),
        rowKey,
        true /* isUserNavigation */,
        MailListItemSelectionSource.MailListItemTwisty
    );
}
