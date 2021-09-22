import { getBposNavBarData } from 'owa-bpos-store';
import { getDefaultCalendar } from 'owa-calendar-cache';
import type { LocalCalendarEntry } from 'owa-graph-schema';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

const TEAMS_WORKLOAD_ID = 'ShellSkypeTeams';

export default function isMeetNowEnabled(): boolean {
    if (isConsumer()) {
        return true;
    }
    const navBarData = getBposNavBarData();

    // Grab default calendar information to determine the default online meeting provider.
    // This should be replaced once Teams provides a UES service in FY21Q3
    const defaultCalendarEntry = getDefaultCalendar() as LocalCalendarEntry;
    const defaultMeetingProvider = defaultCalendarEntry?.DefaultOnlineMeetingProvider;

    return !!(
        navBarData?.WorkloadLinks?.some(item => item.Id === TEAMS_WORKLOAD_ID) &&
        !!defaultMeetingProvider &&
        defaultMeetingProvider === 'TeamsForBusiness'
    );
}
