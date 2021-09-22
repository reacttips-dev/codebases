import loadConversationReadingPane from './loadConversationReadingPane';
import loadItemReadingPane from './loadItemReadingPane';
import setItemReadingPaneViewState from './setItemReadingPaneViewState';
import type { ObservableMap } from 'mobx';
import { lazyTrySaveAndCloseCompose } from 'owa-mail-compose-actions';
import { ComposeViewState, composeStore } from 'owa-mail-compose-store';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import { action } from 'satcheljs/lib/legacy';
import {
    ConversationItem,
    getSelectedTableView,
    listViewStore,
    MailRowDataPropertyGetter,
} from 'owa-mail-list-store';

export interface ReloadReadingPaneState {
    composeViewState: ComposeViewState;
    conversationItems: ObservableMap<string, ConversationItem>;
}

export default action('reloadReadingPane')(function reloadReadingPane(
    state: ReloadReadingPaneState = {
        composeViewState: composeStore.viewStates.get(composeStore.primaryComposeId),
        conversationItems: listViewStore.conversationItems,
    }
) {
    const tableView = getSelectedTableView();
    // tableView is null in Photohub
    const selectedRowKeys = tableView ? [...tableView.selectedRowKeys.keys()] : [];
    if (selectedRowKeys.length == 1) {
        const selectedRowId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(
            selectedRowKeys[0],
            tableView
        );
        const instrumentationContext = getInstrumentationContextsFromTableView(
            selectedRowKeys,
            tableView
        )[0];
        const listViewType = tableView.tableQuery.listViewType;
        if (listViewType === ReactListViewType.Message || shouldShowUnstackedReadingPane()) {
            if (state.composeViewState?.isInlineCompose) {
                lazyTrySaveAndCloseCompose.importAndExecute(state.composeViewState).then(() => {
                    loadItemReadingPane(
                        selectedRowId,
                        instrumentationContext,
                        setItemReadingPaneViewState
                    );
                });
            } else {
                loadItemReadingPane(
                    selectedRowId,
                    instrumentationContext,
                    setItemReadingPaneViewState
                );
            }
        } else if (listViewType === ReactListViewType.Conversation) {
            const selectedConversation = state.conversationItems.get(selectedRowId.Id);
            if (state.composeViewState?.isInlineCompose) {
                lazyTrySaveAndCloseCompose.importAndExecute(state.composeViewState).then(() => {
                    loadConversationReadingPane(
                        selectedRowId,
                        instrumentationContext,
                        selectedConversation.subject
                    );
                });
            } else {
                loadConversationReadingPane(
                    selectedRowId,
                    instrumentationContext,
                    selectedConversation.subject
                );
            }
        }
    }
});
