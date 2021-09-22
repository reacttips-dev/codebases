import { getSelectedCalendars } from './getSelectedCalendars';

export function getSelectedCalendarsCount(userIdentity?: string): number {
    if (userIdentity) {
        return getSelectedCalendarsCountForUser(userIdentity);
    } else {
        return getSelectedCalendarsCountForAllMailboxes();
    }
}

function getSelectedCalendarsCountForAllMailboxes(): number {
    let selectedCalendars = getSelectedCalendars();
    let selectedCalendarsCount = 0;

    selectedCalendars.forEach((value, key) => {
        if (value) {
            selectedCalendarsCount += value.length;
        }
    });
    return selectedCalendarsCount;
}

function getSelectedCalendarsCountForUser(userIdentity: string): number {
    let selectedCalendars = getSelectedCalendars().get(userIdentity);
    return selectedCalendars ? selectedCalendars.length : 0;
}
