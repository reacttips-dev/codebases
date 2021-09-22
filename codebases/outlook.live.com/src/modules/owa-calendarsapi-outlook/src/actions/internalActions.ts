import { action } from 'satcheljs';
import type { LoadState } from '../store/schema/LoadState';

export const setCalendarLoadState = action(
    'setCalendarLoadState',
    (calendarId: string, loadState: LoadState) => ({ calendarId, loadState })
);
