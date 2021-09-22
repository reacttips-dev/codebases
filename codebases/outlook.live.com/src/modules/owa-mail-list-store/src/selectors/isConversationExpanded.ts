import listViewStore from '../store/Store';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

export function isFirstLevelExpanded(rowKey: string): boolean {
    return (
        shouldShowUnstackedReadingPane() &&
        isConversationExpanded(rowKey) &&
        !!listViewStore.expandedConversationViewState.forks
    );
}

export function isSecondLevelExpanded(rowKey: string): boolean {
    if (shouldShowUnstackedReadingPane()) {
        return isConversationExpanded(rowKey) && !listViewStore.expandedConversationViewState.forks;
    }
    return isConversationExpanded(rowKey);
}

export function isLoadingSecondLevelExpansion(rowKey: string): boolean {
    const expansionState = listViewStore.expandedConversationViewState;
    const isLoadingExpansion =
        expansionState.expandedRowKey == rowKey && expansionState.shouldBeExpanded;
    return shouldShowUnstackedReadingPane() && isLoadingExpansion && !expansionState.forks;
}

function isConversationExpanded(rowKey: string): boolean {
    return (
        listViewStore.expandedConversationViewState.expandedRowKey == rowKey &&
        !listViewStore.expandedConversationViewState.shouldBeExpanded
    );
}
