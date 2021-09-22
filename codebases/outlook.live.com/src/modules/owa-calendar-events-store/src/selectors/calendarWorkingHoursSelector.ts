import { getStore } from '../store/store';

export function getCalendarFolderWorkingHours(folderId: string) {
    const store = getStore();
    const { calendarFolderWorkingHours } = store;
    return calendarFolderWorkingHours.get(folderId);
}
