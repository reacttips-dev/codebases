import { TodoListFolderId, TodoListId, TodoListIdType, TodoListMyDayId } from './schema/TodoListId';
import type { TodoListCallbackPayload } from './schema/TodoListCallbackPayload';
import type { TodoUpdateListCallbackPayload } from './schema/TodoUpdateListCallbackPayload';
import { TodoListInteraction } from './schema/TodoListInteraction';

export function isTodoFolderList(listId: TodoListId): listId is TodoListFolderId {
    return listId && listId.type === TodoListIdType.Folder;
}
export function isTodoMyDayList(listId: TodoListId): listId is TodoListMyDayId {
    return listId && listId.type === TodoListIdType.MyDay;
}

export function isTodoListUpdateListCallback(
    payload: TodoListCallbackPayload
): payload is TodoUpdateListCallbackPayload {
    return payload && payload.type === TodoListInteraction.UpdateList;
}
