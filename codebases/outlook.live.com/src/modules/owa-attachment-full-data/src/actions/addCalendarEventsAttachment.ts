import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type AddToCalendarSource from '../schema/AddToCalendarSource';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';

const addCalendarEventsAttachment = action(
    'addCalendarEventsAttachment',

    (attachment: AttachmentFullViewState, source: AddToCalendarSource) =>
        addDatapointConfig(
            {
                name: 'AttachmentAddCalendarEvent',
                customData: {
                    addToCalendarSource: source,
                },
            },
            {
                attachment,
            }
        )
);

export default addCalendarEventsAttachment;
