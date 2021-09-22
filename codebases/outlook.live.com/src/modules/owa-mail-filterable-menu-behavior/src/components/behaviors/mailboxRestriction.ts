import { xor } from './utils/xor';
import { MailboxType } from '../Behaviors.types';
import { isFolderUnderMsg } from 'owa-folders';
import { isGroupTableQuery } from 'owa-group-utils';
import { getSelectedTableView, TableQuery } from 'owa-mail-list-store';
import { isFolderUnderArchiveRoot } from 'owa-mail-store';
import getSelectedFolder from 'owa-mail-store/lib/utils/getSelectedFolder';
import { getUserConfiguration } from 'owa-session-store';

const mailboxRestriction = (mailboxTypes: MailboxType[], shouldHide?: boolean) => () => {
    const { tableQuery } = getSelectedTableView();
    const isMbxScenario = mailboxTypes.some(mailboxType =>
        isMailboxScenario(mailboxType, tableQuery)
    );
    return xor(shouldHide, isMbxScenario);
};

/**
 * Calculates whether user's state is in a given mailbox type
 */
function isMailboxScenario(mailboxType: MailboxType, tableQuery: TableQuery) {
    const selectedFolder = getSelectedFolder();
    const isShadowMailMBX = getUserConfiguration().SessionSettings.IsShadowMailbox;
    switch (mailboxType) {
        case MailboxType.ArchiveMBX:
            return tableQuery.folderId && isFolderUnderArchiveRoot(tableQuery.folderId);

        case MailboxType.GroupMBX:
            return isGroupTableQuery(tableQuery);

        case MailboxType.ShadowMBX:
            return isShadowMailMBX;

        case MailboxType.PrimaryMBX:
            // Shadow mailbox has same msgfolderroot name as primary mailbox, adding !isShadowMailMBX to not return PrimaryMBX type when we have shadowMailBox as true
            return !isShadowMailMBX && selectedFolder && isFolderUnderMsg(selectedFolder);

        case MailboxType.SharedFolderMBX:
            return 'SharedMailbox' == selectedFolder?.mailboxInfo.type;
    }
}

export default mailboxRestriction;
