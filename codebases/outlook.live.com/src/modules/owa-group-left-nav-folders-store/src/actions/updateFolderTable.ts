import { mutatorAction } from 'satcheljs';
import store from '../store/store';
import { GroupFolderHierarchy } from '../store/schema/GroupFolderHierarchy';

export default mutatorAction(
    'updateFolderTable',
    (groupSmtp: string, folderHierarchy: GroupFolderHierarchy) => {
        store.folderTable.set(groupSmtp, folderHierarchy);
    }
);
