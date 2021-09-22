import { getStore } from '../store/store';
import { mutator } from 'satcheljs';
import { uploadFolderLoaded } from '../actions/publicActions';

mutator(uploadFolderLoaded, actionMessage => {
    const { mailboxId, uploadFolder } = actionMessage;
    const store = getStore();

    store.uploadFolders.set(mailboxId, uploadFolder);
});
