import type { CalendarGroup } from 'owa-graph-schema';
import CalendarGroupType from 'owa-service/lib/contract/CalendarGroupType';
import type { MailboxType } from 'owa-client-ids';
import { getCalendarGroups } from './calendarsCacheSelectors';

/**
 * Gets sorted calendar groups for an account
 */
export function getSortedCalendarGroups(account: string): CalendarGroup[] {
    // filter and sort group for account
    return getCalendarGroups()
        .filter(group => isGroupInAccount(group, account))
        .sort(compareGroupsByGroupType);
}

function isGroupInAccount(group: CalendarGroup, userIdentity: string): boolean {
    return !!group && group.calendarGroupId.mailboxInfo.userIdentity === userIdentity;
}

function compareGroupsByGroupType(a: CalendarGroup, b: CalendarGroup) {
    // 1. compare by group type
    const groupTypeDiff =
        CalendarGroupTypeOrdering[a.GroupType] - CalendarGroupTypeOrdering[b.GroupType];
    if (groupTypeDiff !== 0) {
        return groupTypeDiff;
    }

    // 2. compare by mailbox type
    const groupMailboxTypeDiff =
        CalendarGroupMailboxTypeOrdering[a.calendarGroupId.mailboxInfo.type] -
        CalendarGroupMailboxTypeOrdering[b.calendarGroupId.mailboxInfo.type];
    if (groupMailboxTypeDiff !== 0) {
        return groupMailboxTypeDiff;
    }

    // 3. tie-break on alphabetical order
    return a.GroupName.localeCompare(b.GroupName);
}

/** Lookup map for sorting calendar groups by group type */
const CalendarGroupTypeOrdering: { [key in CalendarGroupType]: number } = {
    [CalendarGroupType.MyCalendars]: 0,
    [CalendarGroupType.PeoplesCalendars]: 1,
    [CalendarGroupType.OtherCalendars]: 2,
    [CalendarGroupType.Normal]: 3,
};

/** Lookup map for sorting calendar groups by mailbox type */
const CalendarGroupMailboxTypeOrdering: { [key in MailboxType]: number } = {
    ['UserMailbox']: 0,
    ['TeamsMailbox']: 1,
    ['GroupMailbox']: 2,
    ['PublicMailbox']: 3,
    ['SharedMailbox']: 4,
    ['ArchiveMailbox']: 5,
};
