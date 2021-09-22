import autoMarkItemAsRead from '../helpers/autoMarkItemAsRead';
import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import { listViewStore } from 'owa-mail-list-store';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { orchestrator } from 'satcheljs';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import getItemIdForMailList from 'owa-mail-store/lib/selectors/getItemIdForMailList';

/**
 * Called when the item part is selected in the list view.
 * Marks the previously selected itempart fork as read if unstacked reading pane setting is on.
 */
orchestrator(mailListSelectionActionsV2.singleSelectItemPart, actionMessage => {
    const { tableViewId, currentSelectedNodeIds, rowKey } = actionMessage;
    if (getUserConfiguration().UserOptions.PreviewMarkAsRead == 'OnSelectionChange') {
        if (shouldShowUnstackedReadingPane()) {
            if (currentSelectedNodeIds?.length === 1) {
                const tableView = listViewStore.tableViews.get(tableViewId);
                autoMarkItemAsRead(
                    getItemIdForMailList(currentSelectedNodeIds[0], isFirstLevelExpanded(rowKey)),
                    tableView
                );
            }
        }
    }
});
