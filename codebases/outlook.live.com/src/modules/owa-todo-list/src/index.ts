import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';
import { TodoListActionPayload, isSwitchListAndCreateTodos } from 'owa-todo-list-types';
import { assertNever } from 'owa-assert';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "TodoList" */ './lazyIndex'));

// Delayed Loaded Components
export const TaskListView = createLazyComponent(lazyModule, m => m.TaskListView);

// Delayed Loaded Actions
const lazySwitchListAndCreateTasks = new LazyAction(lazyModule, m => m.switchListAndCreateTasks);
const lazyInitializePublicTodoListAction = new LazyAction(
    lazyModule,
    m => m.initializePublicTodoListAction
);

export async function todoListAction(scenarioId: string, payload: TodoListActionPayload) {
    const { initializePayload, actionPayload } = payload;
    // before any action is executed, initialize the panel
    await lazyInitializePublicTodoListAction.importAndExecute(scenarioId, initializePayload);
    if (actionPayload) {
        if (isSwitchListAndCreateTodos(actionPayload)) {
            lazySwitchListAndCreateTasks.importAndExecute(scenarioId, actionPayload);
        } else {
            assertNever(actionPayload);
        }
    }
}

// Non-lazy actions
export { clickTaskItem } from './actions/publicActions';
