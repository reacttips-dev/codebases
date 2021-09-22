import { orchestrator } from 'satcheljs';
import getItemIdsToShowFromNodeOrThreadIds from 'owa-mail-store/lib/selectors/getItemIdsToShowFromNodeOrThreadIds';
import { listViewStore } from 'owa-mail-list-store';
import markItemsAsReadBasedOnNodeIds from '../actions/actionCreators/markItemsAsReadBasedOnNodeIds';
import markItemsAsReadBasedOnItemIds from '../helpers/markItemsAsReadBasedOnItemIds';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';

export default orchestrator(markItemsAsReadBasedOnNodeIds, actionMessage => {
    const tableView = listViewStore.tableViews.get(actionMessage.tableViewId);
    const rowKeys = [...tableView.selectedRowKeys.keys()];
    const itemIds = getItemIdsToShowFromNodeOrThreadIds(
        actionMessage.nodeIds,
        isFirstLevelExpanded(rowKeys[0])
    );

    markItemsAsReadBasedOnItemIds(
        tableView,
        itemIds,
        actionMessage.isReadValueToSet,
        actionMessage.isExplicit,
        actionMessage.actionSource,
        null /* instrumentationContexts */
    );
});
