import addPublicFolderToStore from '../actions/addPublicFolderToStore';
import type { MailFolder } from 'owa-graph-schema';
import { mutator } from 'satcheljs';
import { mapOWSFolderToGql } from 'owa-folder-gql-mappers';
import getPublicFolderMailboxInfoForSmtpAddress from '../services/utils/getPublicFolderMailboxInfoForSmtpAddress';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default mutator(addPublicFolderToStore, actionMessage => {
    const { state, item } = actionMessage;
    let folderId = item.FolderId.Id;
    const publicFolderMailbox = getUserConfiguration().SessionSettings.DefaultPublicFolderMailbox;
    const mailboxInfo = getPublicFolderMailboxInfoForSmtpAddress(publicFolderMailbox);

    if (!state.folderTable.has(folderId)) {
        let folder: MailFolder = {
            ...mapOWSFolderToGql(item, mailboxInfo),
        };

        state.folderTable.set(folderId, folder);
    }
});
