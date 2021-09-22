import getStore from '../store/store';
import type { ClientItemId } from 'owa-client-ids';
import type { TimePanelSource } from 'owa-time-panel-bootstrap';

/**
 * Indicates whether minimum data needed to unblock panel render has been loaded
 *
 * Currently includes:
 *   - Time Panel settings
 *   - Primary calendar account info
 *   - Calendar cache for primary account (not including updated folder IDs)
 *
 * TODO: VSO #86844 Update calendar views to show loading state until minimum data for render is ready
 * This work item will separate out all calendar-specific dependencies to be handled the Calendar tab
 * rather than as panel-level concerns
 */
export function isPanelInitialized(): boolean {
    return getStore().isPanelInitialized;
}

export function isPanelOpen(): boolean {
    return getStore().isPanelOpen;
}

export function getTimePanelSource(): TimePanelSource {
    return getStore().source;
}

export function getSelectedCalendarItemId(): ClientItemId | null {
    return getStore().selectedCalendarItemId;
}

export function getSelectedTaskId(): string | null {
    return getStore().selectedTaskId;
}
