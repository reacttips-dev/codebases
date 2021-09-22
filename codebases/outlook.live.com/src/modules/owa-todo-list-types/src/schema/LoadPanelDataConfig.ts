import type { FolderType } from 'owa-todo-types';
import type { TodoListId } from './TodoListId';

export type LoadPanelDataConfig = ByFolderType | ByListId;

export enum LoadPanelDataConfigType {
    FolderType,
    ListId,
}
export interface ByFolderType {
    type: LoadPanelDataConfigType.FolderType;
    folderType: FolderType;
}

export interface ByListId {
    type: LoadPanelDataConfigType.ListId;
    listId: TodoListId;
}

export function isByFolderType(config: LoadPanelDataConfig): config is ByFolderType {
    return config.type === LoadPanelDataConfigType.FolderType;
}

export function isByListId(config: LoadPanelDataConfig): config is ByListId {
    return config.type === LoadPanelDataConfigType.ListId;
}
