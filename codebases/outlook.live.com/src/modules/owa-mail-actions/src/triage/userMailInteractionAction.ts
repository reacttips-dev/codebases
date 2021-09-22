import { action } from 'satcheljs';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type { TriageContext } from './TriageContext';

// Currently only suppored in compose (i.e. without index)
// | 'MarkMessageAsImportant'
// | 'MarkMessageAsUnimportant'
// | 'MarkMessageAsNormal'

export type ActionType =
    | 'LinkClicked'
    | 'Delete'
    | 'Move'
    | 'Flag'
    | 'FlagComplete'
    | 'FlagCleared'
    | 'Categorize'
    | 'MarkAsRead'
    | 'MarkAsReadImplicit'
    | 'MarkAsUnread'
    | 'MarkAsJunk'
    | 'Print'
    | 'Reply'
    | 'ReplyAll'
    | 'Forward'
    | 'OpenedAnAttachment'
    | 'PreviewOfAttachmentStarted'
    | 'ModernGroupsQuickReply'
    | 'ModernGroupsConversationSelected'
    | 'MarkAsNotSpam'
    | 'Unsubscribe'
    | 'ReportAndDelete'
    | 'MarkAsPhishing'
    | 'PopOut'
    | 'ReadingPaneDisplayStart'
    | 'ReadingPaneDisplayEnd'
    | 'Pin'
    | 'Unpin'
    | 'Ignore'
    | 'Like'
    | 'Reaction'
    | 'Search'
    | 'Snooze'
    | 'Restore'
    | 'Block'
    | 'ReportAbuse'
    | 'CreateRule';

export let userMailInteractionAction = action(
    'USERMAIL_INTERACTION',
    (
        interactionType: ActionType,
        instrumentationContexts: InstrumentationContext[],
        triageContext?: TriageContext
    ) => {
        return {
            interactionType,
            instrumentationContexts,
            triageContext,
        };
    }
);

export default function (
    interactionType: ActionType,
    instrumentationContexts: InstrumentationContext[],
    triageContext?: TriageContext
) {
    if (instrumentationContexts && instrumentationContexts.length > 0) {
        userMailInteractionAction(interactionType, instrumentationContexts, triageContext);
    }
}
