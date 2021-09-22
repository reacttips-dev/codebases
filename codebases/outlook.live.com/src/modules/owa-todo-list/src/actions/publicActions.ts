import { action } from 'satcheljs';
import type { SwitchListAndCreateTodos } from 'owa-todo-list-types';

/**
 * This switches the list to the list specified by listId. If there is no listId provided, and we can create tasks in the the currently selected list view,
 * then we do not switch folders. If we cannot create tasks in the current list view, we switch to the default
 * folder list view.
 */
export const switchListAndCreateTasks = action(
    'switchListAndCreateTasks',
    (scenarioId: string, payload: Omit<SwitchListAndCreateTodos, 'type'>) => ({
        scenarioId,
        payload,
    })
);

export const clickTaskItem = action('clickTaskItem', (scenarioId: string, taskId: string) => ({
    scenarioId,
    taskId,
}));
