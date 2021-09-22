import triggerAllApiEvents from '../triggerAllApiEvents';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { getAdapter } from 'owa-addins-adapters';

export function triggerRecipientsChangedEvent(hostItemIndex: string, result: any) {
    const adapter = getAdapter(hostItemIndex);
    if (
        adapter != null &&
        (adapter.mode === ExtensibilityModeEnum.AppointmentOrganizer ||
            adapter.mode === ExtensibilityModeEnum.MessageCompose)
    ) {
        triggerAllApiEvents(
            hostItemIndex,
            OutlookEventDispId.RECIPIENTS_CHANGED_EVENT_DISPID,
            () => {
                return result;
            }
        );
    }
}
