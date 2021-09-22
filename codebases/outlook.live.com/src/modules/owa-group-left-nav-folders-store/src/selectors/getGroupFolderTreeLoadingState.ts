import { GroupFolderTreeLoadStateEnum } from '../store/schema/GroupFolderTreeLoadStateEnum';
import leftNavGroupFoldersStore from '../store/store';

export function getGroupFolderTreeLoadingState(groupId: string): GroupFolderTreeLoadStateEnum {
    const folderHierarchy = leftNavGroupFoldersStore.folderTable?.get(groupId.toLowerCase());
    return folderHierarchy?.loadingState || GroupFolderTreeLoadStateEnum.Uninitialized;
}
