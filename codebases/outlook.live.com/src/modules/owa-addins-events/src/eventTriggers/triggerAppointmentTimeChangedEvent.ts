import triggerAllApiEvents from '../triggerAllApiEvents';
import { AppointmentComposeAdapter, getAdapter } from 'owa-addins-adapters';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';

export function triggerAppointmentTimeChangedEvent(hostItemIndex: string, result: any) {
    const adapter = getAdapter(hostItemIndex) as AppointmentComposeAdapter;
    if (adapter != null && adapter.mode === ExtensibilityModeEnum.AppointmentOrganizer) {
        triggerAllApiEvents(
            hostItemIndex,
            OutlookEventDispId.APPOINTMENT_TIME_CHANGED_EVENT_DISPID,
            () => {
                return result;
            }
        );
    }
}
