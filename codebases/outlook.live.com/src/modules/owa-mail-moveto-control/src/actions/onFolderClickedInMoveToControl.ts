import { action } from 'satcheljs';
import type { MailboxType } from 'owa-graph-schema';

/**
 * Action raised once folder selection changes
 * @param mailboxType type of folder clicked
 * @param folderId Folder Id of clicked folder
 */
export default action(
    'ON_FOLDER_CLICKED_IN_MOVEIN_CONTROL',
    (mailboxType: MailboxType, folderId: string) => ({ mailboxType, folderId })
);
