import type { CalendarEntry, LinkedCalendarEntry, LocalCalendarEntry } from 'owa-graph-schema';
import { isTeamsCalendarEntry } from './calendarsCacheSelectors';
import { isConnectedAccount, isOutlookConsumerAccount } from 'owa-accounts-store';
import { extractTrueProperty } from 'owa-calendar-properties';
import SubscriptionMailboxType from 'owa-service/lib/contract/SubscriptionMailboxType';
import type SubscriptionParameters from 'owa-service/lib/contract/SubscriptionParameters';
import { isDefaultMailbox } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Return the folder, mailbox id and type needed for each particular type of calendar item subscription.
 */
export default function getSubscriptionFolderIdAndMailboxDetails(
    calendarEntry: CalendarEntry
): Pick<SubscriptionParameters, 'FolderId' | 'MailboxId' | 'MailboxType'> | null {
    // For group calendars the group name is sufficient.
    // The server will subscribe using OWA's CalendarItemBrokerHandler and the Broker's OwaCalendarItemNotificationHandler.
    if (calendarEntry.IsGroupMailboxCalendar) {
        const emailAddress = (calendarEntry as LinkedCalendarEntry).OwnerEmailAddress;
        const userIdentity = calendarEntry.calendarId.mailboxInfo.userIdentity;
        return {
            MailboxId:
                isTeamsCalendarEntry(calendarEntry) && isFeatureEnabled('cal-showAddTeamsCalendars')
                    ? extractTrueProperty(emailAddress)
                    : emailAddress,
            MailboxType: isConnectedAccount(userIdentity)
                ? SubscriptionMailboxType.ConsumerGroup
                : SubscriptionMailboxType.BusinessGroup,
        };
    }

    // For local calendars on the primary account, use the folderId.
    // The server will subscribe using the MAPI notification handler directly.
    // For calendars from a consumer account, we need to send the folderId,
    // mailbox id and the mailbox type.
    const { FolderId } = calendarEntry as LocalCalendarEntry;
    if (FolderId) {
        const userIdentity = calendarEntry.calendarId.mailboxInfo.userIdentity;
        return isDefaultMailbox(userIdentity)
            ? { FolderId: FolderId.Id }
            : isConnectedAccount(userIdentity)
            ? {
                  FolderId: FolderId.Id,
                  MailboxId: userIdentity,
                  MailboxType: isOutlookConsumerAccount(userIdentity)
                      ? SubscriptionMailboxType.ConsumerSecondaryMailbox
                      : SubscriptionMailboxType.GmailSecondaryMailbox,
              }
            : null;
    }

    // If we add support for other types of calendars, include their case here.
    // For example, can we subscribe to "old-model" shared calendars, where we have a LinkedCalendarEntry
    // that is NOT a group mailbox and has the owner's e-mail address in OwnerEmailAddress?
    // I've tried, but got "The notification receiver does not have enough permission to make this subscription."

    // Unsupported cases should return null so we don't bombard the server with requests that cannot be fulfilled.
    return null;
}
