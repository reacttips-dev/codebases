// schema
export { EMAIL_ENTITY_TYPE } from './schema/LinkedEntity';
export type { default as LinkedEntity } from './schema/LinkedEntity';
export {
    DRAGGED_EMAIL_ENTITY_SUBTYPE,
    HIGHLIGH_TASK_ENTITY_SUBTYPE,
    CONTEXT_MENU_EMAIL_ENTITY_SUBTYPE,
} from './schema/LinkedEmail';
export type { LinkedEmail } from './schema/LinkedEmail';
export type { default as Subtodo } from './schema/Subtodo';
export { default as TaskImportance } from './schema/TaskImportance';
export type { default as TaskStatus } from './schema/TaskStatus';
export type { default as Todo } from './schema/Todo';
export type { FolderType } from './schema/TodoFolder';
export type { FolderSyncStatus } from './schema/TodoFolder';
export type { default as TodoFolder } from './schema/TodoFolder';
export type { ViewType } from './schema/telemetry/ViewType';
export type { ActionSource } from './schema/telemetry/ActionSource';

// utils
export { isTodoType } from './utils/isTodoType';
export { createSubtodo } from './utils/createSubtodo';
export { createTodo } from './utils/createTodo';
export { createTodoFolder } from './utils/createTodoFolder';
export { extractTodosFromMailListItemDragData } from './utils/extractTodosFromMailListItemDragData';
