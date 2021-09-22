import loadConversationReadingPane from './loadConversationReadingPane';
import { updatePrimaryReadingPaneTabId } from '../mutators/primaryReadingPaneTabIdMutators';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import type { ClientItemId } from 'owa-client-ids';
import { lazyMoveComposeToTab } from 'owa-mail-compose-actions';
import findComposeFromTab from 'owa-mail-compose-actions/lib/utils/findComposeFromTab';
import { AsyncSendState, ComposeViewState } from 'owa-mail-compose-store';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import { mailStore } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getActiveContentTab, TabType } from 'owa-tab-store';
import { action } from 'satcheljs/lib/legacy';
import { updateAttachments } from 'owa-mail-actions/lib/conversationLoadActions';

export interface LoadConversationReadingPaneForSingleMailItemSelectedState {
    conversationReadingPaneState: ConversationReadingPaneViewState;
    hasConversationInMailStore: boolean;
}

export default action('loadConversationReadingPaneForSingleMailItemSelected')(
    function loadConversationReadingPaneForSingleMailItemSelected(
        conversationId: ClientItemId,
        isUserNavigation: boolean,
        instrumentationContext: InstrumentationContext,
        conversationSubject: string,
        conversationCategories: string[],
        itemToScrollTo?: string,
        state: LoadConversationReadingPaneForSingleMailItemSelectedState = {
            conversationReadingPaneState: getConversationReadingPaneViewState(),
            hasConversationInMailStore: mailStore.conversations.has(conversationId?.Id),
        }
    ): Promise<void> {
        instrumentationContext?.dp?.addCheckpoint?.('LCRPFSMIS');
        // Skip if conversation id is null
        if (!conversationId) {
            return Promise.resolve();
        }
        const activeTab = getActiveContentTab();
        const composeViewState: ComposeViewState = state.conversationReadingPaneState
            ? findComposeFromTab(
                  activeTab,
                  state.conversationReadingPaneState.conversationId.Id,
                  ReactListViewType.Conversation
              )
            : null;
        // Skip if user has not explicitly asked to navigate to a different conversation (!isUserNavigation)
        if (
            composeViewState &&
            composeViewState.asyncSendState !== AsyncSendState.Delay &&
            !isUserNavigation
        ) {
            return Promise.resolve();
        }
        // Loading the same conversation in the same folder
        if (
            state.conversationReadingPaneState?.conversationId.Id == conversationId.Id &&
            state.conversationReadingPaneState?.currentSelectedFolderId ==
                getFolderIdForSelectedNode() &&
            state.hasConversationInMailStore
        ) {
            // update attachments to get the latest token
            updateAttachments();
            return Promise.resolve();
        }

        if (
            composeViewState &&
            activeTab.type != TabType.SecondaryReadingPane &&
            !composeViewState.isInlineCompose
        ) {
            // In the drafts folder, full compose opens in Primary tab.
            lazyMoveComposeToTab.importAndExecute(composeViewState, true, false);
        }

        updatePrimaryReadingPaneTabId(conversationId);
        return loadConversationReadingPane(
            conversationId,
            instrumentationContext,
            conversationSubject,
            conversationCategories,
            itemToScrollTo
        );
    }
);
