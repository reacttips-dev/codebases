import type { FilterBase, OrFilter, TermFilter } from '../../../data/schema/SubstrateSearchRequest';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID } from 'owa-folders-constants';

export default function createFoldersFilter(
    folderIds: string[],
    folderNames: string[],
    includeDeleted: boolean,
    defaultFolderName: string = null
): FilterBase[] {
    const terms: TermFilter[] = [];
    /**
     * If there are no folderIds and no folderNames, then add a default folder
     * filter if present.
     */
    if (folderIds.length === 0 && folderNames.length === 0 && defaultFolderName != null) {
        folderIds.push(folderNameToId(defaultFolderName));
    }

    for (const folderName of folderNames) {
        terms.push({
            Term: {
                DistinguishedFolderName: folderName,
            },
        });
    }

    for (const folderId of folderIds) {
        // If using 3S to search Archive mailboxes in the All Folder scope, remove any
        // folder filter from the query so it will search across all auxiliary archive
        // mailboxes if they exist
        if (folderId && folderIdToName(folderId) == ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID) {
            return [];
        }
        terms.push({
            Term: {
                FolderId: folderId,
            },
        });
    }

    if (includeDeleted) {
        terms.push({
            Term: {
                DistinguishedFolderName: 'DeletedItems',
            },
        });
    }

    const filterBases: FilterBase[] = [];
    const orFilter: OrFilter = {
        Or: terms,
    };
    filterBases.push(orFilter);

    return terms.length > 0 ? filterBases : null;
}
