import { ComposeLifecycleEvent, AsyncSendState } from 'owa-mail-compose-store';
import { orchestrator } from 'satcheljs';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import moveReadingPaneToTab from '../actions/moveReadingPaneToTab';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export const onOpenInlineComposeOrchestrator = orchestrator(
    onComposeLifecycleEvent,
    actionMessage => {
        const { event, viewState } = actionMessage;
        if (event == ComposeLifecycleEvent.Opened && viewState.isInlineCompose) {
            const readingPane = getConversationReadingPaneViewState();

            // Note: readingPane.conversationId is id of current visible reading pane, it may not be the same with primary reading pane.
            // But it doesn't matter because moveReadingPaneToTab() will check if there is already a secondary tab with the same id,
            // it will not add one more tab.
            if (readingPane?.conversationId?.Id === viewState.conversationId) {
                moveReadingPaneToTab(
                    readingPane.conversationId,
                    readingPane.conversationSubject,
                    readingPane.conversationCategories,
                    false /*makeActive*/,
                    null /*instrumentationContext*/,
                    ReactListViewType.Conversation /* listViewType */,
                    viewState.asyncSendState == AsyncSendState.Delay
                );
            }
        }
    }
);
