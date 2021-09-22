import {
    CalendarGroupsDocument,
    CalendarGroupsQuery,
    CalendarGroupsQueryVariables,
} from '../graphql/__generated__/CalendarGroupsQuery.interface';

import { getApolloClient } from 'owa-apollo';
import { getCalendarFoldersFromSessionData } from '../services/calendarFoldersFromSessionData';
import { getUserMailboxInfo } from 'owa-client-ids';
import { isDefaultMailbox } from 'owa-session-store';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { mapGetCalendarFoldersResponseToGql } from 'owa-calendars-and-groups-gql-mappers';

type CalendarGroups = CalendarGroupsQuery['calendarGroups'];

export async function getCalendarsService(userIdentity?: string): Promise<CalendarGroups> {
    // when calendarFolderHx hostApp feature is disabled (i.e not running on native), then
    // for primary account, try getting the calendarGroups from session data
    if (
        !isHostAppFeatureEnabled('calendarFolderHx') &&
        (!userIdentity || isDefaultMailbox(userIdentity))
    ) {
        const response = getCalendarFoldersFromSessionData();
        if (response) {
            return Promise.resolve(
                mapGetCalendarFoldersResponseToGql(response, getUserMailboxInfo(userIdentity))
            );
        }
    }

    return exportedHelperFunctions.invokeCalendarGroupsQuery({
        mailboxInfo: getUserMailboxInfo(userIdentity),
    });
}

/**
 * Invoke the calendar groups query
 * @param input input parameters for the query
 */
const invokeCalendarGroupsQueryFn = async function invokeCalendarGroupsQuery(
    input: CalendarGroupsQueryVariables
): Promise<CalendarGroups> {
    const client = getApolloClient();
    const result = await client.query({
        variables: input,
        query: CalendarGroupsDocument,
    });

    return result?.data?.calendarGroups;
};

/**
 * This helper method is exported so it can be mocked for unit testing
 */
export const exportedHelperFunctions = {
    invokeCalendarGroupsQuery: invokeCalendarGroupsQueryFn,
};
