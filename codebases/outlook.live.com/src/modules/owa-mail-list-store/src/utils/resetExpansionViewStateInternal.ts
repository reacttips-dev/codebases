import { BusStopState, listViewStore } from '../index';
import { ObservableMap } from 'mobx';

export default function resetExpansionViewStateInternal() {
    const expansionState = listViewStore.expandedConversationViewState;

    expansionState.expandedRowKey = null;
    expansionState.focusedNodeId = null;
    expansionState.selectedNodeIds = [];
    expansionState.allNodeIds = [];
    expansionState.shouldBeExpanded = false;
    expansionState.busStopStateMap = new ObservableMap<string, BusStopState>({});
    expansionState.forks = null;
}
