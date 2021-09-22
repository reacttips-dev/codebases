import { getUserConfiguration } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';

export function shouldShowDeclinedEvents() {
    return isFeatureEnabled('cal-surface-declinedMeetings')
        ? getUserConfiguration().ViewStateConfiguration.CalendarViewShowDeclinedMeetings
        : false;
}
