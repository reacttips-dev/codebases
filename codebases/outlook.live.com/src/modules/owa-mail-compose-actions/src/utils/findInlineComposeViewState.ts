import { TabType, TabState } from 'owa-tab-store';
import { getStore as getTabStore } from 'owa-tab-store/lib/store/tabStore';
import {
    ComposeViewState,
    AsyncSendState,
    getStore as getComposeStore,
} from 'owa-mail-compose-store';
import { assertNever } from 'owa-assert';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

/**
 * Finds the ComposeViewState from a id tab and returns it.
 * @param {string} id that contains either a ConversationId or a ReferenceItemId property that is part of the ComposeViewState.
 * @param {ReactListViewType} idType that represents either a ConversationView or ItemView to loopk up for the.
 * By default we look for ConversationView ComposeViewStates.
 * @param {boolean} includeDelayedSendState optional parameter to include delayed send states or not.
 * @returns ComposeViewState containing the compose view for the given tab.
 */
export default function findInlineComposeViewState(
    id: string,
    idType: ReactListViewType = ReactListViewType.Conversation, // To keep the existing functionality, by default, the inline compose is a conversation.
    includeDelayedSendState?: boolean,
    projectionRPTabId?: string
): ComposeViewState {
    const composeContainsId = getListViewChecker(idType);
    const composeStore = getComposeStore();

    for (const tab of getTabStore().tabs) {
        if (tab.type == TabType.MailCompose && tab.state == TabState.Hidden) {
            const viewState = composeStore.viewStates.get(tab.data);
            if (
                viewState?.isInlineCompose &&
                composeContainsId(viewState, id) &&
                (viewState.asyncSendState == AsyncSendState.None ||
                    (includeDelayedSendState &&
                        viewState.asyncSendState == AsyncSendState.Delay)) &&
                ((!projectionRPTabId && !tab.projectionRPTabId) ||
                    tab.projectionRPTabId == projectionRPTabId)
            ) {
                return viewState;
            }
        }
    }

    return null;
}

function getListViewChecker(
    reactListViewType: ReactListViewType
): (viewState: ComposeViewState, id: string) => boolean {
    switch (reactListViewType) {
        case ReactListViewType.Conversation:
            return conversationIdChecker;
        case ReactListViewType.Message:
            return referenceItemIdChecker;
        case ReactListViewType.CalendarItems:
            // Need to include all the enums in the callback even if it is not supported.
            // calendarIdChecker function returns always false.
            return calendarIdChecker;
        default:
            return assertNever(reactListViewType);
    }
}

function conversationIdChecker(viewState: ComposeViewState, id: string): boolean {
    return viewState.conversationId === id;
}

function referenceItemIdChecker(viewState: ComposeViewState, id: string): boolean {
    return viewState.referenceItemId.Id === id;
}

function calendarIdChecker(viewState: ComposeViewState, id: string): boolean {
    return false;
}
