import { pushNewView, updateSelectedTask } from '../actions/timePanelStoreActions';
import { TaskScenarioId } from '../constants';
import { isFeatureEnabled } from 'owa-feature-flags';
import { clickTaskItem } from 'owa-todo-list';
import { orchestrator } from 'satcheljs';

export const clickTaskItemOrchestrator = orchestrator(clickTaskItem, actionMessage => {
    if (isFeatureEnabled('todo-details-view') && actionMessage.scenarioId === TaskScenarioId) {
        updateSelectedTask(actionMessage.taskId);
        pushNewView('TaskDetails');
    }
});
