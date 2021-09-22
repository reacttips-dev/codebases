import type { TodoListId } from './TodoListId';
import type { TodoScenarioConfig } from './TodoScenarioConfig';
import type { LoadPanelDataConfig } from './LoadPanelDataConfig';
import type { Todo } from 'owa-todo-types';

export interface TodoListActionPayload {
    initializePayload: InitializePayload;
    actionPayload?: ActionPayload;
}

export type ActionPayload = SwitchListAndCreateTodos;

export interface InitializePayload {
    todoScenarioConfig: TodoScenarioConfig;
    forceReload?: boolean;
    loadPanelDataConfig?: LoadPanelDataConfig;
    preLoadTasks?: Promise<any>[];
}

export interface SwitchListAndCreateTodos {
    type: 'switchListAndCreateTodos';
    todos: Partial<Todo>[];
    listId?: TodoListId;
}

export function isSwitchListAndCreateTodos(
    payload: ActionPayload
): payload is SwitchListAndCreateTodos {
    return payload.type === 'switchListAndCreateTodos';
}
