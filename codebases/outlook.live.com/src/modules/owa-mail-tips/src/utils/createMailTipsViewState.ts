import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type { NestedMruCache } from 'owa-nested-mru-cache';
import type MailTipsCacheEntry from '../store/schema/MailTipsCacheEntry';
import type MailTipDetails from '../store/schema/MailTipDetails';
import { GuestMailTipStatus } from '../store/schema/GuestMailTipStatus';
import type MailTipsViewState from '../store/schema/MailTipsViewState';

/**
 * Returns MailTipsViewState by mapping recipients information to mailtips information.
 */
export default function createMailTipsViewState(
    recipients: EmailAddressWrapper[],
    mailTips: NestedMruCache<MailTipsCacheEntry>,
    fromEmailAddress: string
): MailTipsViewState {
    const initialMailTipInfos: MailTipsViewState = {
        CustomMailTip: <MailTipDetails[]>[],
        DeliveryRestricted: <EmailAddressWrapper[]>[],
        ExternalMemberCount: <MailTipDetails[]>[],
        IsModerated: <EmailAddressWrapper[]>[],
        MailboxFull: <EmailAddressWrapper[]>[],
        MaxMessageSize: <EmailAddressWrapper[]>[],
        OutOfOffice: <MailTipDetails[]>[],
        PreferAccessibleContent: <EmailAddressWrapper[]>[],
        TotalMemberCount: <MailTipDetails[]>[],
        GuestsDisabledGroupsWithGuests: <EmailAddressWrapper[]>[],
    };
    // Simple uniqBy without lodash
    const recipientNames = recipients.map(recipient => recipient.EmailAddress);
    const uniqueRecipients: EmailAddressWrapper[] = recipients.filter(
        (recipient, index) => recipientNames.indexOf(recipient.EmailAddress) === index
    );
    return uniqueRecipients.reduce((finalMailTips, recipient) => {
        const mailTipsCacheEntry = mailTips.get(fromEmailAddress, recipient.EmailAddress);
        const recipientMailTips = mailTipsCacheEntry ? mailTipsCacheEntry.value : {};

        if (recipientMailTips.DeliveryRestricted) {
            finalMailTips.DeliveryRestricted.push(recipient);
        }
        if (recipientMailTips.IsModerated) {
            finalMailTips.IsModerated.push(recipient);
        }
        if (recipientMailTips.MailboxFull) {
            finalMailTips.MailboxFull.push(recipient);
        }
        if (recipientMailTips.OutOfOffice) {
            finalMailTips.OutOfOffice.push({
                recipient,
                message: recipientMailTips.OutOfOffice,
            });
        }
        if (recipientMailTips.PreferAccessibleContent) {
            finalMailTips.PreferAccessibleContent.push(recipient);
        }
        // Check if guest mail tip status is calculated and group has guests
        if (
            recipientMailTips.GuestStatus & GuestMailTipStatus.IsCalculated &&
            recipientMailTips.GuestStatus & GuestMailTipStatus.GroupHasGuests
        ) {
            // Check if guests are disabled
            if ((recipientMailTips.GuestStatus & GuestMailTipStatus.GuestsEnabled) == 0) {
                finalMailTips.GuestsDisabledGroupsWithGuests.push(recipient);
            } else {
                // Otherwise add to list of external recipients
                finalMailTips.ExternalMemberCount.push({
                    recipient,
                    count: 1,
                });
            }
        } else if (recipientMailTips.ExternalMemberCount) {
            finalMailTips.ExternalMemberCount.push({
                recipient,
                count: recipientMailTips.ExternalMemberCount,
            });
        }
        if (recipientMailTips.TotalMemberCount) {
            finalMailTips.TotalMemberCount.push({
                recipient,
                count: recipientMailTips.TotalMemberCount,
            });
        }
        if (recipientMailTips.CustomMailTip) {
            finalMailTips.CustomMailTip.push({
                recipient,
                message: recipientMailTips.CustomMailTip,
            });
        }
        return finalMailTips;
    }, initialMailTipInfos);
}
