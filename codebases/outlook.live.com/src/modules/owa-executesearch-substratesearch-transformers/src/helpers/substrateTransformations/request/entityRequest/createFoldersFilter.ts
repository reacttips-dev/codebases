import type { FilterBase } from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import { createFoldersFilter } from 'owa-search-service';
import type DistinguishedFolderId from 'owa-service/lib/contract/DistinguishedFolderId';
import type BaseSearchScopeType from 'owa-service/lib/contract/BaseSearchScopeType';
import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type LargeArchiveSearchScopeType from 'owa-service/lib/contract/LargeArchiveSearchScopeType';
import type PrimaryMailboxSearchScopeType from 'owa-service/lib/contract/PrimaryMailboxSearchScopeType';
import type SearchFolderScopeType from 'owa-service/lib/contract/SearchFolderScopeType';
import SearchScopeArchives from 'owa-service/lib/contract/SearchScopeArchives';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

const DEFAULT_FOLDERNAME_MAIL: string = 'MsgFolderRoot';

export function createFoldersFilterFromExecuteSearchRequest(
    request: ExecuteSearchJsonRequest
): FilterBase[] {
    // Get folderIds and folderNames from SearchScope.
    const folderInformation = parseSearchScopeForFoldersFilters(request.Body.SearchScope);

    const { folderIds, folderNames } = folderInformation;

    return createFoldersFilter(
        folderIds,
        folderNames,
        request.Body.IncludeDeleted,
        request.Body.ItemTypes !== 'CalendarItems' ? DEFAULT_FOLDERNAME_MAIL : null
    );
}

function parseSearchScopeForFoldersFilters(
    searchScopes: BaseSearchScopeType[]
): { folderIds: string[]; folderNames: string[] } {
    const folderIds: string[] = [];
    const folderNames: string[] = [];

    if (searchScopes && searchScopes.length > 0) {
        for (const searchScope of searchScopes) {
            const searchScopeType = searchScope.__type;

            if (searchScopeType === 'PrimaryMailboxSearchScopeType:#Exchange') {
                addFolderIdsAndNamesFromSearchScope(
                    (searchScope as PrimaryMailboxSearchScopeType).FolderScope,
                    folderIds,
                    folderNames
                );
            } else if (searchScopeType === 'SingleLargeArchiveSearchScopeType:#Exchange') {
                addFolderIdsAndNamesFromSearchScope(
                    (searchScope as PrimaryMailboxSearchScopeType).FolderScope,
                    folderIds,
                    folderNames
                );
            } else if (searchScopeType === 'LargeArchiveSearchScopeType:#Exchange') {
                const largeArchiveSearchScopeType = searchScope as LargeArchiveSearchScopeType;

                if (
                    (largeArchiveSearchScopeType.ArchiveTypes & SearchScopeArchives.MainArchive) ===
                    SearchScopeArchives.MainArchive
                ) {
                    folderNames.push('archivemsgfolderroot');
                }
            }
        }
    }

    return {
        folderIds,
        folderNames,
    };
}

function addFolderIdsAndNamesFromSearchScope(
    folderScope: SearchFolderScopeType,
    folderIds: string[],
    folderNames: string[]
) {
    const baseFolderId = folderScope.BaseFolderId;
    const folderScopeType = folderScope.BaseFolderId.__type;

    if (folderScopeType === 'FolderId:#Exchange') {
        folderIds.push((baseFolderId as FolderId).Id);
    } else if (folderScopeType === 'DistinguishedFolderId:#Exchange') {
        const distinguishedFolderId = (baseFolderId as DistinguishedFolderId).Id;

        /**
         * While we should use FolderId instead of DistinguishedFolderName for
         * 3S filtering, the "All folders" scope is the exception and the service
         * requires it be specified by DistinguishedFolderName instead.
         */
        if (distinguishedFolderId.toLowerCase() === 'msgfolderroot') {
            folderNames.push(distinguishedFolderId);
        } else {
            const folderId = folderNameToId(distinguishedFolderId);
            folderIds.push(folderId);
        }
    }
}
