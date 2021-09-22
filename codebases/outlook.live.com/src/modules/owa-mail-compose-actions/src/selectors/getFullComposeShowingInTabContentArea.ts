import { ComposeViewState, ComposeStore, getStore } from 'owa-mail-compose-store';
import { getActiveContentTab, TabType, TabViewState } from 'owa-tab-store';

export default function getFullComposeShowingInTabContentArea(): ComposeViewState {
    const activeTab = getActiveContentTab();
    const store = getStore();
    const composeId = activeTab ? getComposeIdFromTab(activeTab, store) : store.primaryComposeId;
    const viewState = composeId ? store.viewStates.get(composeId) : null;
    return viewState && !viewState.isInlineCompose ? viewState : null;
}

function getComposeIdFromTab(tab: TabViewState, store: ComposeStore): string {
    switch (tab.type) {
        case TabType.Primary:
            return store.primaryComposeId;
        case TabType.MailCompose:
            return tab.data;
        default:
            return null;
    }
}
