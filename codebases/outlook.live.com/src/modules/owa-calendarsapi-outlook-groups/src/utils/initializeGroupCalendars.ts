import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { getCalendarGroupKey, getCalendarGroups } from 'owa-calendar-cache';

import { GROUP_CALENDAR_GROUP_ID } from '../constants';
import { action } from 'satcheljs/lib/legacy';
import { getGroupCalendars } from './getGroupCalendars';
import { getUserConfigurationForUser } from 'owa-session-store';
import { getUserMailboxInfo } from 'owa-client-ids';

export const initializeGroupCalendars = action('initializeGroupCalendars')(
    async function initializeGroupCalendars(userIdentity: string, refresh?: boolean) {
        const datapoint = new PerformanceDatapoint('initializeGroupCalendars');

        if (!userIdentity) {
            // get default account's mailboxId
            userIdentity = getUserMailboxInfo().userIdentity;
        }

        // Issue the network call if we are refreshing the set of group calendars because of a
        // group-association notification OR if the group calendars have not yet been loaded.
        // This way we avoid making the same network request twice during startup when Mail opens
        // a group calendar explicitly, ie, via /calendar/group/<tenant>/<groupName>.
        const GroupsEnabled: boolean = !!getUserConfigurationForUser(userIdentity)?.GroupsEnabled;

        const groupId = getCalendarGroupKey(userIdentity, GROUP_CALENDAR_GROUP_ID);
        const initialLoad = !getCalendarGroups().some(
            x =>
                x.serverGroupId === groupId &&
                x.calendarGroupId.mailboxInfo.userIdentity === userIdentity
        );
        const issueServiceCall = GroupsEnabled && (refresh || initialLoad);

        datapoint.addCustomData({
            issueServiceCall,
            GroupsEnabled,
            featureEnabled: true, // feature flag is enabled WW
            refresh,
            initialLoad,
        });

        try {
            if (issueServiceCall) {
                await getGroupCalendars(userIdentity);
            }
            datapoint.end();
        } catch (error) {
            datapoint.endWithError(DatapointStatus.ServerError, Error(error));
            throw error;
        }
    }
);
