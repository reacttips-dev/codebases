import filterInvalidRecipients from './filterInvalidRecipients';
import { isSameStringIgnoreCase, isSelf } from './isSelf';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import getSenderInRecipients from './fromAddressUtils/getSenderInRecipients';

function isSameAddressWrapper(
    address1: EmailAddressWrapper,
    address2: EmailAddressWrapper
): boolean {
    return (
        address1 == address2 ||
        (address1 &&
            address2 &&
            isSameStringIgnoreCase(address1.EmailAddress, address2.EmailAddress))
    );
}

function firstIndexOf(array: EmailAddressWrapper[], address: EmailAddressWrapper) {
    if (array != null && array.length > 0) {
        for (let index = 0; index < array.length; index++) {
            if (isSameAddressWrapper(array[index], address)) {
                return index;
            }
        }
    }

    return -1;
}

function getRecipientsWithoutMyselfAndSender(
    targetRecipients: EmailAddressWrapper[],
    otherRecipients: EmailAddressWrapper[],
    exclusions?: EmailAddressWrapper[]
): EmailAddressWrapper[] {
    const sender = getSenderInRecipients(targetRecipients, otherRecipients);
    return targetRecipients.filter(recipient => {
        // Filter when:
        // 1. The email is yourself (includes default and alias) AND there's no ReplyTo
        //    (for cases where the via address is in the well explicitly, see desc in getToRecipients)
        // 2. It's on the exclusions list.
        return (
            recipient &&
            !isSameStringIgnoreCase(recipient.EmailAddress, sender) &&
            firstIndexOf(exclusions, recipient) == -1
        );
    });
}

function getToRecipients(
    originalFrom: EmailAddressWrapper,
    originalTo: EmailAddressWrapper[],
    originalCc: EmailAddressWrapper[],
    originalReplyTo: EmailAddressWrapper[],
    isReplyAll: boolean
): EmailAddressWrapper[] {
    let toRecipients: EmailAddressWrapper[] = [];
    if (isReplyAll) {
        // Add the address from the original From well to the new To well
        // Exclude if:
        // 1. Address belongs to self (e.g., replying to an email in the Sent folder)
        // 2. ReplyTo is provided, i.e. when the address that should be replied to is different from the one in the From well
        //    (For example, if you are sent an email from Azure DevOps Notifications about Bob creating a PR
        //     Your reply should be sent to Bob rather than Azure DevOps Notifications)
        const hasReplyTo: boolean = originalReplyTo && originalReplyTo.length > 0;
        if (originalFrom && !isSelf(originalFrom) && !hasReplyTo) {
            toRecipients.push(originalFrom);
        }

        // Add the addresses from the original To well to the new To well
        toRecipients = toRecipients.concat(
            originalTo
                ? getRecipientsWithoutMyselfAndSender(
                      originalTo /* targetRecipients */,
                      originalCc /* otherRecipients */,
                      toRecipients /* exclusions */
                  )
                : []
        );
    } else {
        // Typically, the reply message's recipient should be the original message's sender
        // With this logic, replying to your own message would send it back to yourself
        // The recipient should stay the same if the following are true in the original message (VSO 29873):
        // 1. The sender is yourself
        // 2. There is only one recipient (one To recipient, zero CC recipients), and the recipient is NOT yourself
        const singleRecipient = originalTo && originalTo.length === 1 && originalTo[0];
        const noCcRecipients: boolean = !originalCc || originalCc.length === 0;
        if (isSelf(originalFrom) && noCcRecipients && singleRecipient && !isSelf(singleRecipient)) {
            toRecipients = [singleRecipient];
        } else if (originalFrom) {
            toRecipients = [originalFrom];
        }
    }

    return toRecipients;
}

function processReplyToHeader(
    toRecipients: EmailAddressWrapper[],
    ccRecipients: EmailAddressWrapper[],
    replyTo: EmailAddressWrapper[],
    isReplyAll: boolean
): [EmailAddressWrapper[], EmailAddressWrapper[]] {
    if (replyTo != null && replyTo.length > 0) {
        if (isReplyAll) {
            // For reply all, the reply-to header recipients are added to To if:
            // 1. it does not already exist in To
            // 2. if it exists in Cc, it goes to To and the corresponding Cc is removed
            replyTo.forEach(replyToRecipient => {
                const indexInToRecipients = firstIndexOf(toRecipients, replyToRecipient);
                if (indexInToRecipients == -1) {
                    const indexInCcRecipients = firstIndexOf(ccRecipients, replyToRecipient);
                    if (indexInCcRecipients != -1) {
                        ccRecipients.splice(indexInCcRecipients, 1);
                    }

                    toRecipients.push(replyToRecipient);
                }
            });
        } else {
            // For reply, the Reply-To header should replace the To recipient
            toRecipients = replyTo;
        }
    }

    return [toRecipients, ccRecipients];
}

export default function getToCcRecipients(
    originalFrom: EmailAddressWrapper,
    originalTo: EmailAddressWrapper[],
    originalCc: EmailAddressWrapper[],
    originalReplyTo: EmailAddressWrapper[],
    isReplyAll: boolean
): [EmailAddressWrapper[], EmailAddressWrapper[]] {
    let toRecipients = getToRecipients(
        originalFrom,
        originalTo,
        originalCc,
        originalReplyTo,
        isReplyAll
    );
    let ccRecipients =
        isReplyAll && originalCc
            ? getRecipientsWithoutMyselfAndSender(
                  originalCc /* targetRecipients */,
                  originalTo /* otherRecipients */,
                  toRecipients /*exclusions*/
              )
            : [];

    [toRecipients, ccRecipients] = processReplyToHeader(
        toRecipients,
        ccRecipients,
        originalReplyTo,
        isReplyAll
    );

    // If we end up without a recipient at all, put the excluded original from to the to field if it is present
    if (originalFrom != null && toRecipients.length == 0 && ccRecipients.length == 0) {
        toRecipients.push(originalFrom);
    }

    // At this point, we should filter invalid recipients.
    return [filterInvalidRecipients(toRecipients), filterInvalidRecipients(ccRecipients)];
}
