import { fetchUploadFolder } from '../services/fetchUploadFolder';
import { getUploadFolder } from '../selectors/uploadFolderSelectors';
import { orchestrator } from 'satcheljs';
import { preloadUploadFolder } from '../actions/publicActions';

orchestrator(preloadUploadFolder, async actionMessage => {
    const { mailboxId, uploadFolderMailboxType } = actionMessage;
    const uploadFolder = getUploadFolder(mailboxId);

    if (!uploadFolder) {
        // Only fetch upload folder if it is not already fetched
        await fetchUploadFolder(mailboxId, uploadFolderMailboxType);
    }
});
