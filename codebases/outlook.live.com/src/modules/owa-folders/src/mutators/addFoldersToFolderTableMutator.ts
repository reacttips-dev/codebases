import { ObservableMap } from 'mobx';
import type { MailFolder } from 'owa-graph-schema';
import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';
import getFolderTable from '../selectors/getFolderTable';

export const addFoldersToFolderTableMutator = mutatorAction(
    'addFoldersToFolderTableMutator',
    (folders: { [id: string]: MailFolder }) => {
        const folderTable = getFolderTable();
        if (folderTable.size == 0) {
            getStore().folderTable = new ObservableMap();
        }

        Object.keys(folders).forEach(id => {
            const newFolder = JSON.parse(JSON.stringify(folders[id]));
            getFolderTable().set(id, newFolder);
        });
    }
);
