import {
    pushNewView,
    updateSelectedCalendarEvent,
    updateSelectedTask,
} from '../actions/timePanelStoreActions';
import { orchestrator } from 'satcheljs';
import {
    clickCalendarEvent,
    doubleClickCalendarEvent,
    openComposeView,
    clickAgendaTodo,
} from 'owa-time-panel-calendar-list';
import { lazyOpenComposeFormInline } from 'owa-time-panel-compose';
import { isFeatureEnabled } from 'owa-feature-flags';

export const clickCalendarEventOrchestrator = orchestrator(clickCalendarEvent, actionMessage => {
    const { id } = actionMessage;
    updateSelectedCalendarEvent(id);
    pushNewView('EventDetails');
});

export const doubleClickCalendarEventOrchestrator = orchestrator(
    doubleClickCalendarEvent,
    actionMessage => {
        const { id } = actionMessage;
        updateSelectedCalendarEvent(id);
        pushNewView('EventDetails');
    }
);

export const openComposeViewOrchestrator = orchestrator(openComposeView, actionMessage => {
    pushNewView('ComposeForm');
    lazyOpenComposeFormInline.importAndExecute(actionMessage.entrySource, actionMessage.event);
});

export const clickAgendaTodoOrchestrator = orchestrator(clickAgendaTodo, actionMessage => {
    if (isFeatureEnabled('todo-details-view')) {
        updateSelectedTask(actionMessage.todoId);
        pushNewView('TaskDetails');
    }
});
