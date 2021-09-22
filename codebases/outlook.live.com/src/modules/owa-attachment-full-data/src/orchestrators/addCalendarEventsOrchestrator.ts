import addCalendarEventsAttachment from '../actions/addCalendarEventsAttachment';
import addCompletedAction from '../actions/addCompletedAction';
import setOngoingActionAndActionMessage from '../actions/setOngoingActionAndActionMessage';
import { stopFakeProgressIndicator } from '../utils/FakeProgressIndicator';
import { ActionMessageId, ActionType, AttachmentFullViewState } from '../index';
import importCalendarEventService, {
    ImportEventsFromIcsFileResult,
} from 'owa-calendar-services/lib/services/importCalendarEventService';
import type { ClientAttachmentId } from 'owa-client-ids';
import { orchestrator } from 'satcheljs';

// exporting it for the testing purpose
export default orchestrator(addCalendarEventsAttachment, async actionMessage => {
    addToCalendarPreProcess(actionMessage.attachment);
    let response: ImportEventsFromIcsFileResult;
    try {
        response = await importCalendarEventService(
            null /* content */,
            null /* importedItemFolderId */,
            null /* calendarId */,
            actionMessage.attachment.attachmentId.Id
        );
    } catch {}

    const eventSucessState = response
        ? ActionMessageId.ImportToCalendarCompletedWithIcon
        : ActionMessageId.ImportToCalendarFailedWithIcon;

    addToCalendarPostProcess(
        actionMessage.attachment.attachmentId,
        eventSucessState,
        actionMessage.attachment,
        ActionType.None,
        ActionType.AddToCalendar
    );
});

// Explicitely exporitng AddToCalendarSource as this enum, which is passed from subscribed action, is private to this file
export { default as AddToCalendarSource } from '../schema/AddToCalendarSource';

function addToCalendarPreProcess(attachment: AttachmentFullViewState) {
    setOngoingActionAndActionMessage(
        attachment,
        ActionType.AddToCalendar,
        ActionMessageId.ImportToCalendarInProgress
    );
}

function addToCalendarPostProcess(
    attachmentId: ClientAttachmentId,
    eventSucessState: ActionMessageId,
    attachment: AttachmentFullViewState,
    onGoingActionType: ActionType,
    completedActionType: ActionType
) {
    stopFakeProgressIndicator(attachmentId, true);
    addCompletedAction(attachment, completedActionType);
    setOngoingActionAndActionMessage(attachment, onGoingActionType, eventSucessState);
}
