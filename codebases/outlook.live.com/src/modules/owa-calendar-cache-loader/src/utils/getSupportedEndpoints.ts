import { getDefaultLogonEmailAddress } from 'owa-session-store';
import { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getSupportedEndpoints(userId?: string): CalendarEndpointType[] {
    if (!userId || userId === getDefaultLogonEmailAddress()) {
        // Primary account
        return [
            CalendarEndpointType.Outlook,
            CalendarEndpointType.OutlookGroup,
            CalendarEndpointType.TeamsCalendars,
        ];
    } else {
        // Connected account
        const supportedConnectedAccountEndpoints = [CalendarEndpointType.Outlook];

        if (isFeatureEnabled('cal-multiAccounts-groups')) {
            supportedConnectedAccountEndpoints.push(CalendarEndpointType.OutlookGroup);
        }
        return supportedConnectedAccountEndpoints;
    }
}
