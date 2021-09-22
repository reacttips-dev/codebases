import { logUsage } from 'owa-analytics';

/**
 * Types of user actions supported on the mailtips infobar
 */
export enum MailTipsActionType {
    RemoveRecipient,
    ShowDetails,
    HideDetails,
    RemoveAll,
    ShowMore,
    ShowLess,
    EmailClicked,
    AccCheckerClick,
}

/**
 * Categories of mailtips supported for compose scenario
 */
export enum MailTipsCategory {
    None,
    OutOfOffice,
    LargeAudience,
    IsModerated,
    CustomMailTip,
    PreferAccessibleContent,
    MailboxFull,
    DeliveryRestricted,
    GuestsDisabledGroupsWithGuests,
    ExternalMemberCount,
}

/**
 * If the mailtip is displayed for a single recipient/multi recipient
 */
export enum MailTipsType {
    None,
    SingleRecipient,
    MultipleRecipients,
}

/**
 * Currently displayed mailtips map
 */
export interface MailTipsViewStateMap {
    AutomaticReply?: MailTipsType;
    LargeAudience?: MailTipsType;
    ModeratedMailbox?: MailTipsType;
    PrefersAccessibility?: MailTipsType;
    MailboxFull?: MailTipsType;
    DeliveryRestricted?: MailTipsType;
    GuestMailtip?: MailTipsType;
    ExternalMembers?: MailTipsType;
    CustomMailtip?: MailTipsType;
}

function customDataForAllShownMailtips(mailTipsViewStateMap: MailTipsViewStateMap) {
    return [
        mailTipsViewStateMap.AutomaticReply,
        mailTipsViewStateMap.LargeAudience,
        mailTipsViewStateMap.ModeratedMailbox,
        mailTipsViewStateMap.PrefersAccessibility,
        mailTipsViewStateMap.MailboxFull,
        mailTipsViewStateMap.DeliveryRestricted,
        mailTipsViewStateMap.GuestMailtip,
        mailTipsViewStateMap.ExternalMembers,
        mailTipsViewStateMap.CustomMailtip,
    ];
}

const MailtipsActionDatapointName = 'MailtipsActionDatapoint';
const RecipientRemovedFromRecipientWellDatapointName = 'RecipientRemovedFromRecipientWellDatapoint';
export { MailtipsActionDatapointName, RecipientRemovedFromRecipientWellDatapointName };

export function logRecipientRemovedFromRecipientWellDatapoint(
    mailTipsViewStateMap: MailTipsViewStateMap
) {
    if (
        Object.keys(mailTipsViewStateMap).some(
            key => mailTipsViewStateMap[key] != MailTipsType.None
        )
    ) {
        logUsage(
            'RecipientRemovedFromRecipientWellDatapoint',
            customDataForAllShownMailtips(mailTipsViewStateMap)
        );
    }
}

export function logSendActionMailTipsDatapoint(mailTipsViewStateMap: MailTipsViewStateMap) {
    if (
        Object.keys(mailTipsViewStateMap).some(
            key => mailTipsViewStateMap[key] != MailTipsType.None
        )
    ) {
        logUsage(
            'SendActionMailTipsDatapoint',
            customDataForAllShownMailtips(mailTipsViewStateMap)
        );
    }
}

export function logDiscardActionMailTipsDatapoint(mailTipsViewStateMap: MailTipsViewStateMap) {
    if (
        Object.keys(mailTipsViewStateMap).some(
            key => mailTipsViewStateMap[key] != MailTipsType.None
        )
    ) {
        logUsage(
            'DiscardActionMailTipsDatapoint',
            customDataForAllShownMailtips(mailTipsViewStateMap)
        );
    }
}

export function roundOffCount(recipientCount: number): number {
    return recipientCount > 23 ? 23 : recipientCount;
}
