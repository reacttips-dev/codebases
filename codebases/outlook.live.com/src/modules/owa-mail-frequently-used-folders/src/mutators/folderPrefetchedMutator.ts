import { mutator } from 'satcheljs';
import { getStore } from '../store/store';
import folderPrefetchedAction from '../actions/folderPrefetchedAction';

export default mutator(folderPrefetchedAction, actionMessage => {
    getStore().prefetchedFolderIds.set(actionMessage.folderId, true);
});
