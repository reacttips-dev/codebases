import { getCalendarGroupKey } from 'owa-calendar-cache';
import type {
    CalendarEntry,
    CalendarGroup,
    LinkedCalendarEntry,
    LocalCalendarEntry,
} from 'owa-graph-schema';
import { MailboxInfo, getUserMailboxInfo } from 'owa-client-ids';

import CalendarColor from 'owa-service/lib/contract/CalendarColor';
import CalendarGroupType from 'owa-service/lib/contract/CalendarGroupType';
import { GROUP_CALENDAR_GROUP_ID } from '../constants';
import type GetUserUnifiedGroupsJsonResponse from 'owa-service/lib/contract/GetUserUnifiedGroupsJsonResponse';
import type RequestedUnifiedGroupsSet from 'owa-service/lib/contract/RequestedUnifiedGroupsSet';
import type UnifiedGroup from 'owa-service/lib/contract/UnifiedGroup';
import UnifiedGroupsFilterType from 'owa-service/lib/contract/UnifiedGroupsFilterType';
import type UnifiedGroupsSet from 'owa-service/lib/contract/UnifiedGroupsSet';
import UnifiedGroupsSortType from 'owa-service/lib/contract/UnifiedGroupsSortType';
import { action } from 'satcheljs/lib/legacy';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import getUserUnifiedGroupsOperation from 'owa-service/lib/operation/getUserUnifiedGroupsOperation';
import getUserUnifiedGroupsRequest from 'owa-service/lib/factory/getUserUnifiedGroupsRequest';
import { groupCalendarsText } from './getGroupCalendarsService.locstring.json';
import loc from 'owa-localize';

async function createUserUnifiedGroupsRequest(
    userIdentity: string
): Promise<GetUserUnifiedGroupsJsonResponse> {
    let requestedUnifiedGroupsSets: RequestedUnifiedGroupsSet[] = [];
    let sortType = UnifiedGroupsSortType.Relevance;

    requestedUnifiedGroupsSets.push({
        FilterType: UnifiedGroupsFilterType.Favorites,
        SortType: sortType,
        SortDirection: 'Descending',
    });

    requestedUnifiedGroupsSets.push({
        FilterType: UnifiedGroupsFilterType.ExcludeFavorites,
        SortType: sortType,
        SortDirection: 'Descending',
    });

    const requestHeaders = getJsonRequestHeader();
    requestHeaders.RequestServerVersion = 'V2018_01_08';

    const options = getMailboxRequestOptions(getUserMailboxInfo(userIdentity));

    const response = await getUserUnifiedGroupsOperation(
        {
            Header: requestHeaders,
            Body: getUserUnifiedGroupsRequest({
                RequestedGroupsSets: requestedUnifiedGroupsSets,
            }),
        },
        options
    );

    return response;
}

export interface GroupCalendarResult {
    entry: CalendarEntry | LocalCalendarEntry;
    groupMailboxGuid: string;
}

export interface GetGroupCalendarsServiceResult {
    groupCalendars: GroupCalendarResult[];
    calendarGroup: CalendarGroup;
}

/**
 * Makes the GetUserUnifiedGroups call to the server to get the Groups the user is subscribed to
 * @returns GetGroupCalendarsServiceResult with collection of GroupCalendarResult
 */
let getGroupCalendarsService = action('getGroupCalendarsService')(
    async function getGroupCalendarsService(
        userIdentity: string
    ): Promise<GetGroupCalendarsServiceResult> {
        const result = await createUserUnifiedGroupsRequest(userIdentity);
        if (result != null && result.Body.GroupsSets && result.Body.GroupsSets.length > 0) {
            return processResponse(result.Body.GroupsSets, userIdentity);
        }

        return null;
    }
);

export default getGroupCalendarsService;

function processResponse(
    groupsSet: UnifiedGroupsSet[],
    userIdentity: string
): GetGroupCalendarsServiceResult {
    const groupCalendarsResult: GroupCalendarResult[] = [];

    // we need to append the userMailboxId to the parentGroupId (unlike normal calendars)
    // because this group calendar's calendarEntry has no other way to associate with the user mailbox
    // and we need it, so that we can show right group calendars per account (in getCalendarsForCalendarGroup)
    const parentGroupId = getCalendarGroupKey(userIdentity, GROUP_CALENDAR_GROUP_ID);

    groupsSet.forEach((groupSet: UnifiedGroupsSet) => {
        groupSet.Groups.forEach((group: UnifiedGroup) => {
            let groupEmailAddress: string = group.SmtpAddress.toLowerCase();

            let groupMailboxInfo: MailboxInfo = {
                type: 'GroupMailbox',
                userIdentity: userIdentity,
                mailboxSmtpAddress: groupEmailAddress,
            };

            let calendarEntry: LinkedCalendarEntry = {
                calendarId: {
                    id: groupEmailAddress,
                    mailboxInfo: groupMailboxInfo,
                },
                CalendarColor: CalendarColor.Auto,
                CalendarName: group.DisplayName,
                OwnerEmailAddress: groupEmailAddress,
                OwnerName: group.DisplayName,
                IsGroupMailboxCalendar: true,
                IsGeneralScheduleCalendar: true,
                ParentGroupId: parentGroupId,
                CanShare: false,
                DistinguishedFolderId: groupEmailAddress,
                __typename: 'LinkedCalendarEntry',
            };

            groupCalendarsResult.push({
                entry: calendarEntry,
                groupMailboxGuid: group.MailboxGuid?.toLowerCase(),
            });
        });
    });

    if (groupCalendarsResult.length > 0) {
        const groupsCalendarGroupMailboxInfo: MailboxInfo = {
            type: 'GroupMailbox',
            userIdentity: userIdentity, // identity of the account to which these group calendars are associated with
            mailboxSmtpAddress: userIdentity,
        };
        const resultGroup: CalendarGroup = {
            calendarGroupId: {
                id: parentGroupId,
                mailboxInfo: groupsCalendarGroupMailboxInfo,
            },
            serverGroupId: parentGroupId,
            GroupName: loc(groupCalendarsText),
            GroupType: CalendarGroupType.Normal,
        };

        return {
            groupCalendars: groupCalendarsResult,
            calendarGroup: resultGroup,
        };
    } else {
        return null;
    }
}
