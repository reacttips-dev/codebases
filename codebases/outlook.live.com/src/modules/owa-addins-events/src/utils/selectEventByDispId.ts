import getAppointmentTimeChangedEvent from '../events/getAppointmentTimeChangedEvent';
import getDisplayDialogEvent from '../events/getDisplayDialogEvent';
import getItemChangedEvent from '../events/getItemChangedEvent';
import getLocationsChangedEvent from '../events/getLocationsChangedEvent';
import getRecipientsChangedEvent from '../events/getRecipientsChangedEvent';
import getRecurrenceChangedEvent from '../events/getRecurrenceChangedEvent';
import getAttachmentsChangedEvent from '../events/getAttachmentsChangedEvent';
import type { ApiEvent } from '../schema/ApiEvent';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';
import getIframeDialogEvent from '../events/getIframeDialogEvent';

export default function selectEventByDispId(dispId: OutlookEventDispId): ApiEvent {
    switch (dispId) {
        case OutlookEventDispId.DISPLAY_DIALOG_DISPID:
        case OutlookEventDispId.DIALOG_NOTIFICATION_SHOWN_IN_ADDIN_DISPID:
            return getDisplayDialogEvent();
        case OutlookEventDispId.DIALOG_PARENT_MESSAGE_RECEIVED:
            return getIframeDialogEvent();
        case OutlookEventDispId.ITEM_CHANGED_EVENT_DISPID:
            return getItemChangedEvent();
        case OutlookEventDispId.APPOINTMENT_TIME_CHANGED_EVENT_DISPID:
            return getAppointmentTimeChangedEvent();
        case OutlookEventDispId.RECIPIENTS_CHANGED_EVENT_DISPID:
            return getRecipientsChangedEvent();
        case OutlookEventDispId.RECURRENCE_CHANGED_EVENT:
            return getRecurrenceChangedEvent();
        case OutlookEventDispId.LOCATIONS_CHANGED_EVENT:
            return getLocationsChangedEvent();
        case OutlookEventDispId.ATTACHMENTS_CHANGED_EVENT_DISPID:
            return getAttachmentsChangedEvent();
        default:
            throw new Error('ApiEvent not implemented');
    }
}
