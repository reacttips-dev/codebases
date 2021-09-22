import { createOrGetFolder } from './helpers/createOrGetFolder';
import { updateFolderTable } from './helpers/updateFolderTable';
import { onFindDumpsterFolderSuccess } from '../actions/internalActions';
import type * as Schema from 'owa-graph-schema';
import { orchestrator } from 'satcheljs';

orchestrator(onFindDumpsterFolderSuccess, actionMessage => {
    const { rootFolder, folders, principalSMTPAddress } = actionMessage;
    const createOrGetFolder_0 = (folder: Schema.MailFolder) => {
        return createOrGetFolder(folder, principalSMTPAddress);
    };

    updateFolderTable(null /* displayName */, rootFolder, folders, createOrGetFolder_0);
});
