import { getSelectedCalendarsFromTimePanel } from './getSelectedCalendarsFromTimePanel';
import { flattenObservableMapValues } from 'owa-selected-calendars-utils';

/**
 * Gets selected calendars count from Time Panel store, either across all accounts or for a specific account
 *
 * This selector is only meant for internal use where we explicitly want to read from Time Panel config,
 * regardless of which config is currently being referenced to power user experiences
 */
export function getSelectedCalendarsCountFromTimePanel(userIdentity?: string): number {
    if (userIdentity) {
        return getSelectedCalendarsCountForUser(userIdentity);
    } else {
        return getSelectedCalendarsCountForAllMailboxes();
    }
}

function getSelectedCalendarsCountForAllMailboxes(): number {
    return flattenObservableMapValues(getSelectedCalendarsFromTimePanel()).length;
}

function getSelectedCalendarsCountForUser(userIdentity: string): number {
    const selectedCalendars = getSelectedCalendarsFromTimePanel().get(userIdentity);
    return selectedCalendars ? selectedCalendars.length : 0;
}
