import triggerAllApiEvents from '../triggerAllApiEvents';
import { AppointmentComposeAdapter, getAdapter } from 'owa-addins-adapters';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';
import type { AddinRecurrence } from 'owa-addins-recurrence';

export function triggerRecurrenceChangedEvent(hostItemIndex: string, recurrence: AddinRecurrence) {
    const adapter = getAdapter(hostItemIndex) as AppointmentComposeAdapter;
    if (adapter != null && adapter.mode === ExtensibilityModeEnum.AppointmentOrganizer) {
        triggerAllApiEvents(hostItemIndex, OutlookEventDispId.RECURRENCE_CHANGED_EVENT, () => {
            return { recurrence };
        });
    }
}
