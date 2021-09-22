import { TaskScenarioId, TodoScenarioConfigSource } from '../constants';
import type { TimePanelTodoListAction } from '../store/schema/TimePanelTodoListAction';
import { todoListAction } from 'owa-todo-list';

export function timePanelTodoListAction(payload: TimePanelTodoListAction) {
    // create TodoListActionPayload with time panel properties
    const todoListActionPayload = {
        initializePayload: {
            ...payload.initializePayload,
            todoScenarioConfig: { source: TodoScenarioConfigSource },
        },
        actionPayload: payload.actionPayload,
    };
    todoListAction(TaskScenarioId, todoListActionPayload);
}
