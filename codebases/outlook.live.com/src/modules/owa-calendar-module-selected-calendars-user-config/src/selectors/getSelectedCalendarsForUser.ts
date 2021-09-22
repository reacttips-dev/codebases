import { getSelectedCalendars } from './getSelectedCalendars';

export function getSelectedCalendarsForUser(userIdentity: string): string[] {
    const selectedCalendars = getSelectedCalendars().get(userIdentity);
    return selectedCalendars ? selectedCalendars : [];
}
