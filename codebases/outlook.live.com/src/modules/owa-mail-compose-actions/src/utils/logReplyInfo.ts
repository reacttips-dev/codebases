import type { ActionSource } from 'owa-analytics-types';
import type ReplyAllToItem from 'owa-service/lib/contract/ReplyAllToItem';
import type ReplyToItem from 'owa-service/lib/contract/ReplyToItem';
import { default as rcStore } from 'owa-recipient-cache/lib/store/store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { logUsage } from 'owa-analytics';

export function logReplyInfo(
    replyItem: ReplyToItem | ReplyAllToItem,
    composeTraceId: string,
    actionSource: ActionSource,
    referenceItemTimeReceived: string
): void {
    const recipientsCount = getRecipientsCount(replyItem);
    let isFromTopPeople = false;

    if (recipientsCount === 1) {
        const oneToRecipient =
            replyItem.ToRecipients && replyItem.ToRecipients.length > 0
                ? replyItem.ToRecipients[0]
                : undefined;
        isFromTopPeople = oneToRecipient && isEmailInTopRecipientCacheSuggestions(oneToRecipient);
    }

    logUsage('MailComposeReply_Info', {
        composeLogTraceId: composeTraceId,
        recipientsCount: recipientsCount,
        isOneRecipient: recipientsCount === 1,
        isOneRecipientFromTopPeople: isFromTopPeople,
        replySource: actionSource,
        referenceItemDaysOld: getDaysDiff(referenceItemTimeReceived),
    });
}

function getRecipientsCount(replyItem: ReplyToItem | ReplyAllToItem): number {
    return (
        (replyItem.ToRecipients ? replyItem.ToRecipients.length : 0) +
        (replyItem.CcRecipients ? replyItem.CcRecipients.length : 0) +
        (replyItem.BccRecipients ? replyItem.BccRecipients.length : 0)
    );
}

function isEmailInTopRecipientCacheSuggestions(toEmail: EmailAddressWrapper): boolean {
    if (!toEmail || !toEmail.EmailAddress) {
        return false;
    }

    return (
        rcStore.recipientCache &&
        rcStore.recipientCache
            .slice(0, 50)
            .some(
                persona =>
                    persona.EmailAddresses &&
                    persona.EmailAddresses.some(
                        emailAddress =>
                            emailAddress.EmailAddress &&
                            emailAddress.EmailAddress.toLowerCase() ===
                                toEmail.EmailAddress.toLowerCase()
                    )
            )
    );
}

const oneDayInMs = 1000 * 60 * 60 * 24;

function getDaysDiff(timeRecieved: string): number {
    try {
        if (timeRecieved) {
            const received = new Date(timeRecieved);
            const diffMs = Date.now() - received.getTime();
            const diffDays = diffMs / oneDayInMs;

            return diffDays;
        }
    } catch {
        // Do nothing
    }

    return -1;
}
