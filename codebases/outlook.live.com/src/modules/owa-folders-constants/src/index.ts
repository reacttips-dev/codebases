import type { FolderForestTreeType } from 'owa-graph-schema';

export const GEEK_FOLDERS_TO_IGNORE: string[] = ['journal', 'outbox', 'syncissues'];
export const ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID = 'archivemsgfolderroot';
export const PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID = 'msgfolderroot';
export const ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID = 'archivedeleteditems';
export const PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID = 'deleteditems';
export const ARCHIVE_DUMPSTER_DISTINGUISHED_ID = 'archiverecoverableitemsdeletions';
export const PRIMARY_DUMPSTER_DISTINGUISHED_ID = 'recoverableitemsdeletions';
export const SHARED_FOLDER_ROOT_DISTINGUISHED_ID = 'msgfolderroot';
export const SHARED_FOLDERS_TREE_TYPE: FolderForestTreeType = 'sharedFolderTree';
export const PRIMARY_FOLDERS_TREE_TYPE: FolderForestTreeType = 'primaryFolderTree';
export const ARCHIVE_FOLDERS_TREE_TYPE: FolderForestTreeType = 'archiveFolderTree';
export const FAVORITE_FOLDERS_TREE_TYPE: FolderForestTreeType = 'favorites';
