import getFolderTable from '../../selectors/getFolderTable';
import type { MailFolder } from 'owa-graph-schema';
import type * as Schema from 'owa-graph-schema';

/**
 * Creates the Folder by adding client specific properties
 *
 * @param rawFolder Folder object
 * @param principalSMTPAddress Account to which the folder belongs
 */
export function createOrGetFolder(
    rawFolder: Schema.MailFolder,
    principalSMTPAddress: string
): MailFolder {
    if (getFolderTable().has(rawFolder.FolderId.Id)) {
        return getFolderTable().get(rawFolder.FolderId.Id);
    }

    return {
        childFolderIds: [],
        principalSMTPAddress: principalSMTPAddress,
        ...rawFolder,
    };
}
