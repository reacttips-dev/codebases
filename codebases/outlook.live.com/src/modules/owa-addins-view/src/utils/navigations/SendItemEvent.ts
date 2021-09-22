import { GetInitialData, InitialData } from 'owa-addins-apis';
import { OutlookEventDispId, triggerApiEvent } from 'owa-addins-events';

export function sendItemNullEvent(controlId: string): void {
    const newItem: InitialData = null;
    triggerApiEvent(OutlookEventDispId.ITEM_CHANGED_EVENT_DISPID, controlId, newItem);
}

export async function sendItemUpdatedEvent(
    hostItemIndex: string,
    controlId: string
): Promise<void> {
    const newItem: InitialData = await GetInitialData(controlId, hostItemIndex);
    triggerApiEvent(OutlookEventDispId.ITEM_CHANGED_EVENT_DISPID, controlId, newItem);
}
