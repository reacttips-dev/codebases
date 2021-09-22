export enum TodoListIdType {
    Folder,
    MyDay,
}

export interface TodoListIdBase {
    type: TodoListIdType;
}

export interface TodoListFolderId extends TodoListIdBase {
    /**
     * The type of the TodoList
     *
     * @type {TodoListIdType}
     */
    type: TodoListIdType.Folder;

    /**
     * The folderId of the todos in the list. The Id can be null in the default folder case,
     *
     * @type {string | null}
     */
    Id: string | null;
}

// TODO VSO 78581: handle day changes and timezone changes for the my day list
export interface TodoListMyDayId extends TodoListIdBase {
    /**
     * The type of the TodoList
     *
     * @type {TodoListIdType}
     */
    type: TodoListIdType.MyDay;
}

export type TodoListId = TodoListFolderId | TodoListMyDayId;
