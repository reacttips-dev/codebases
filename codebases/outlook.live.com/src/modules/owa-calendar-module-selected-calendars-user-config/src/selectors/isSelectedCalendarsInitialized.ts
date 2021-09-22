import { selectedCalendarsStore } from '../store/store';

export function isSelectedCalendarsInitialized(userIdentity: string): boolean {
    let selectedCalendars = selectedCalendarsStore().selectedCalendars.get(userIdentity);
    return selectedCalendars ? true : false;
}
