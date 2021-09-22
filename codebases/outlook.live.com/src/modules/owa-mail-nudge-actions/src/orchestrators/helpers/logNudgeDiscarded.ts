import { logUsage } from 'owa-analytics';
import { trace } from 'owa-trace';

export function logNudgeDiscarded(
    reason: string,
    nudgeItemId: string,
    nudgeConversationId: string,
    correlationId: string,
    isConversationView: boolean,
    isNudgeFromOtherTable: boolean,
    isInboxTable: boolean,
    lastDeliveryTime: string,
    source: string,
    latestGlobalItemId: string,
    nudgeItemTime: string
) {
    const currentFolder = isInboxTable ? 'inbox' : 'sentitems';

    logUsage(
        'Nudge_Discarded',
        {
            owa_1: reason,
            owa_2: isConversationView,
            owa_3: isNudgeFromOtherTable,
            owa_4: currentFolder,
            owa_5: source,
            rt: lastDeliveryTime,
            itemId: nudgeItemId,
            cId: nudgeConversationId,
            crId: correlationId,
            nIt: nudgeItemTime,
            lGId: latestGlobalItemId,
        },
        {
            isCore: true,
        }
    );

    trace.warn(
        'Nudge Discarded - isConversationView: ' +
            isConversationView +
            ' itemId: ' +
            nudgeItemId +
            ' conversationId: ' +
            nudgeConversationId +
            ' folderId: ' +
            currentFolder +
            ' isNudgeFromOtherTable: ' +
            isNudgeFromOtherTable
    );
}
