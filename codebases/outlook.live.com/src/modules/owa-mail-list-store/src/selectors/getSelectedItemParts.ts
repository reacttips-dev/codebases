import listViewStore from '../store/Store';

export default function getSelectedItemParts(): string[] {
    return listViewStore.expandedConversationViewState.selectedNodeIds;
}
