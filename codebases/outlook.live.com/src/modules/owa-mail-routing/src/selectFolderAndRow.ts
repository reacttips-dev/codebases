import selectFolderWithFallback from './selectFolderWithFallback';
import selectRow from './selectRow';

export default function selectFolderAndRow(folderId: string, rowId: string) {
    selectFolderWithFallback(folderId);
    selectRow(rowId);
}
