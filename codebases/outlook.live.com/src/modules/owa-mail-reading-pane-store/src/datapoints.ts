import type CalendarInlineComposeViewState from './store/schema/CalendarInlineComposeViewState';
import type QuotedBodyViewState from './store/schema/QuotedBodyViewState';
import type { ClientItemId } from 'owa-client-ids';
import type { ActionSource } from 'owa-analytics-types';

export default {
    // Performance data of load conversation reading pane
    RPPerfLoadConversationReadingPane: { name: 'RPPerfLoadConversationReadingPane' },

    // Performance data of load item reading pane
    RPPerfLoadItemReadingPane: {
        name: 'RPPerfLoadItemReadingPane',
    },

    // Counts the number of times users collapse the quoted text
    // CustomData: 1 - isQuotedTextChanged
    //             2 - isExpanded
    RPCountExpCollQuotedText: {
        name: 'RPCountExpCollQuotedText',
        customData: (
            viewState: QuotedBodyViewState,
            itemId: string,
            isQuotedTextChanged: boolean
        ) => {
            return [!!isQuotedTextChanged ? 1 : 0, !viewState.isExpanded];
        },
    },

    // Counts the number of user click to load more
    RPCountLoadMore: { name: 'RPCountLoadMore' },

    RPCountExpCollAllItemParts: {
        name: 'RPCountExpCollAllItemParts',
        customData: (conversationId: string, shouldExpand: boolean, isFromShortcut: boolean) => [
            shouldExpand,
            isFromShortcut,
        ],
    },

    PrintItem: {
        name: 'PrintItem',
        actionSource: (itemId: ClientItemId, actionSource: ActionSource, targetWindow: Window) =>
            actionSource,
    },

    ReplyByMeeting: {
        name: 'ReplyByMeeting',
        actionSource: (
            referenceItemId: string,
            calendarInlineComposeViewState?: CalendarInlineComposeViewState,
            shouldSend?: boolean,
            actionSource?: ActionSource
        ) => actionSource,
    },
};

export function getCountBucket(count: number): number {
    return Math.min(Math.floor(count / 2), 24);
}
