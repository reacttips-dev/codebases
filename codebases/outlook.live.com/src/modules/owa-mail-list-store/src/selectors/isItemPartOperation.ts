import getSelectedTableView from '../utils/getSelectedTableView';
import listViewStore from '../store/Store';

export default function isItemPartOperation() {
    return (
        !getSelectedTableView().isInCheckedMode &&
        listViewStore.expandedConversationViewState.selectedNodeIds.length > 0
    );
}
