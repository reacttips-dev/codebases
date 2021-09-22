import { updateCurrentView } from '../actions/timePanelStoreActions';
import { timePanelTodoListAction } from '../actions/timePanelTodoListAction';
import { assertNever } from 'owa-assert';
import getDefaultStart from 'owa-calendar-forms-common/lib/utils/getDefaultStart';
import type { FullComposeEntrySourceType } from 'owa-calendar-helpers-types';
import { addMinutes, now, OwaDate } from 'owa-datetime';
import { addPopoutV2 } from 'owa-popout-v2';
import { replyByMeetingService } from 'owa-reply-by-meeting-service';
import getDefaultEventDuration from 'owa-session-store/lib/selectors/getDefaultEventDuration';
import { popView } from 'owa-time-panel-bootstrap';
import { getStackLength, getCurrentPanelViewType } from 'owa-time-panel-settings';
import { extractTodosFromMailListItemDragData } from 'owa-todo-types';
import { orchestrator } from 'satcheljs';
import {
    DropTarget,
    createEventFromMailItemDrop,
    createTaskFromMailItemDrop,
    initializeTimePanelDataForDnd,
} from 'owa-time-panel-dnd';

const CALENDAR_POPOUT_OPTIONS = {
    width: 1095,
    height: 640,
};

// Pre-load any data that will be needed for a fast and smooth local lie experience
export const initializeTimePanelDataForDndOrchestrator = orchestrator(
    initializeTimePanelDataForDnd,
    () => {
        const panelViewType = getCurrentPanelViewType();
        switch (panelViewType) {
            case 'Calendar':
                timePanelTodoListAction({ initializePayload: {} });
                break;
            case 'Tasks':
                break;
            default:
                assertNever(panelViewType);
        }
    }
);

export const createEventFromMailItemDropOrchestrator = orchestrator(
    createEventFromMailItemDrop,
    actionMessage => {
        const { dragData, dropTarget, preFillStartTime } = actionMessage;
        if (!dragData) {
            return;
        }

        // close all non-base views and open Calendar view
        while (getStackLength() > 1) {
            popView();
        }
        updateCurrentView('Calendar');

        const referenceItemId = dragData.latestItemIds[0];
        const [startTime, endTime] = getStartEndTime(preFillStartTime);
        const eventIdPromise = replyByMeetingService(
            referenceItemId,
            startTime,
            endTime,
            null /* location */,
            null /* content */,
            false /* shouldSend */
        );

        addPopoutV2(
            'calendar',
            'compose',
            async () => {
                const createdEventId = await eventIdPromise;

                return Promise.resolve(
                    createdEventId
                        ? {
                              draftItemId: createdEventId,
                              extractionSourceId: null,
                              internetMessageId: null,
                              composeEntrySource:
                                  CreateEventDropTargetMappingToFullComposeEntrySourceType[
                                      dropTarget
                                  ],
                              shouldInitializeForNewDraft: true,
                          }
                        : null
                );
            },
            CALENDAR_POPOUT_OPTIONS
        );
    }
);

export const createTaskFromMailItemDropOrchestrator = orchestrator(
    createTaskFromMailItemDrop,
    async actionMessage => {
        const { dragData } = actionMessage;

        if (!dragData) {
            return;
        }

        // close all non-base views and open Tasks view
        while (getStackLength() > 1) {
            popView();
        }
        updateCurrentView('Tasks');
        const partialTodos = extractTodosFromMailListItemDragData(dragData);
        if (partialTodos.length > 0) {
            timePanelTodoListAction({
                initializePayload: {},
                actionPayload: {
                    type: 'switchListAndCreateTodos' as const,
                    todos: partialTodos,
                },
            });
        }
    }
);

function getStartEndTime(preFillStartTime?: OwaDate): [OwaDate, OwaDate] {
    const startDate = preFillStartTime ?? getDefaultStart(now());
    const endDate = addMinutes(startDate, getDefaultEventDuration());

    return [startDate, endDate];
}

const CreateEventDropTargetMappingToFullComposeEntrySourceType: {
    [K in DropTarget]: FullComposeEntrySourceType;
} = {
    TimePanelDropHint: 'TimePanel_DropOnPanelReplyWithMeeting',
    AgendaViewDropHint: 'TimePanel_DropOnAgendaReplyWithMeeting',
    DayViewDropHint: 'TimePanel_DropOnDayReplyWithMeeting',
    DayViewPreviewDropHint: 'TimePanel_DropOnDayReplyWithMeeting',
};
