import { onFilesFolderShown, onFilesTreeRootNodeClicked } from 'owa-mail-folder-store';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

mutator(onFilesTreeRootNodeClicked, actionMessage => {
    const store = getStore();
    store.isExpanded = actionMessage.isExpanded;
});

mutator(onFilesFolderShown, actionMessage => {
    const store = getStore();
    store.isExpanded = actionMessage.isExpanded;
});
