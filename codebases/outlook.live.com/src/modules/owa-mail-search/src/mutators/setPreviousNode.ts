import mailSearchStore from '../store/store';
import type { FolderForestNode } from 'owa-favorites-types';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('setPreviousNode', (previousNode: FolderForestNode): void => {
    mailSearchStore.previousNode = previousNode;
});
