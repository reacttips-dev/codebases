import shareTxpCalendarEventService from '../services/shareTxpCalendarEventService';
import { orchestrator } from 'satcheljs';
import { shareTxpCalendarEvent } from '../actions/publicActions';
import { userInteractionAction } from 'owa-calendar-actions';

orchestrator(shareTxpCalendarEvent, async actionMessage => {
    const {
        itemId,
        requestBody,
        actionSource,
        isOrganizer,
        isMeeting,
        onSuccess,
        onError,
    } = actionMessage;

    try {
        const response = await shareTxpCalendarEventService(itemId, requestBody);

        if (response?.Body && response.Body.ResponseClass === 'Success') {
            userInteractionAction('TxpEventShared', actionSource, isOrganizer, isMeeting);
            onSuccess();
        } else {
            onError(
                new Error(
                    `Failure response from server for shareTxtCalendarEvent for item "${itemId.Id}"`
                )
            );
        }
    } catch (error) {
        onError(error);
    }
});
