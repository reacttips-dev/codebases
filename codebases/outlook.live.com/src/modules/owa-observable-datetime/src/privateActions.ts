import { action } from 'satcheljs';

export const updateTimes = action('updateTimes');
export const setNow = action('setNow');
export const setToday = action('setToday', (today: number) => ({ today }));
