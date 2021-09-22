import { getSelectedCalendarsCountFromTimePanel } from './getSelectedCalendarsCountFromTimePanel';

/**
 * Indicates whether the user has ever selected calendars in Time Panel
 *
 * If not, we should fall back on using Calendar Module selected calendars config
 */
export function hasTimePanelSelectedCalendars(): boolean {
    return getSelectedCalendarsCountFromTimePanel() > 0;
}
