import { action } from 'satcheljs';

export const setDateFormat = action('setDateFormat', (dateFormat: string) => ({ dateFormat }));
export const setTimeFormat = action('setTimeFormat', (timeFormat: string) => ({ timeFormat }));
export const setLocalTimeZone = action('setLocalTimeZone', (timeZone: string | undefined) => ({
    timeZone,
}));
