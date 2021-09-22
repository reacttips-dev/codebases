import { MailTipsViewStateMap, MailTipsType } from '../datapoints';
import getMailTips from '../selectors/getMailTips';
import createMailTipsViewState from './createMailTipsViewState';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import shouldShowLargeAudienceMailTip from './shouldShowLargeAudienceMailTip';

/**
 * Returns MailTipsViewStateMap containing mailtips information from the mailtips cache using recipients and from email address as the key.
 */
export default function getMailTipsViewStateMapFromRecipientEmailAddress(
    recipientEmailAddresses: EmailAddressWrapper[],
    fromEmailAddress: string
): MailTipsViewStateMap {
    let mailTipsMap: MailTipsViewStateMap = {};
    const mailTipsViewState = createMailTipsViewState(
        recipientEmailAddresses,
        getMailTips(),
        fromEmailAddress
    );

    Object.keys(mailTipsViewState).map(key => {
        if (mailTipsViewState[key].length > 0) {
            const status: MailTipsType = getMailTipStatus(mailTipsViewState[key].length);
            switch (key) {
                case 'TotalMemberCount':
                    if (shouldShowLargeAudienceMailTip(mailTipsViewState[key])) {
                        mailTipsMap.LargeAudience = status;
                    }
                    break;
                case 'CustomMailTip':
                    mailTipsMap.CustomMailtip = status;
                    break;
                case 'DeliveryRestricted':
                    mailTipsMap.DeliveryRestricted = status;
                    break;
                case 'ExternalMemberCount':
                    mailTipsMap.ExternalMembers = status;
                    break;
                case 'GuestsDisabledGroupsWithGuests':
                    mailTipsMap.GuestMailtip = status;
                    break;
                case 'IsModerated':
                    mailTipsMap.ModeratedMailbox = status;
                    break;
                case 'MailboxFull':
                    mailTipsMap.MailboxFull = status;
                    break;
                case 'OutOfOffice':
                    mailTipsMap.AutomaticReply = status;
                    break;
                case 'PreferAccessibleContent':
                    mailTipsMap.PrefersAccessibility = status;
                    break;
            }
        }
    });
    return mailTipsMap;
}

function getMailTipStatus(recipientCount: number): MailTipsType {
    return recipientCount > 1 ? MailTipsType.MultipleRecipients : MailTipsType.SingleRecipient;
}
