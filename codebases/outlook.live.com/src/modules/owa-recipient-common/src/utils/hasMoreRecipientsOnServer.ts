import type RecipientCountsType from 'owa-service/lib/contract/RecipientCountsType';

export default function hasMoreRecipientsOnServer(
    recipientCounts: RecipientCountsType,
    toRecipients?: Readonly<any>[],
    ccRecipients?: Readonly<any>[],
    bccRecipients?: Readonly<any>[]
): boolean {
    if (recipientCounts) {
        return !!(
            (toRecipients && toRecipients.length < recipientCounts.ToRecipientsCount) ||
            (ccRecipients && ccRecipients.length < recipientCounts.CcRecipientsCount) ||
            (bccRecipients && bccRecipients.length < recipientCounts.BccRecipientsCount)
        );
    } else {
        return false;
    }
}
