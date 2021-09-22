import { action } from 'satcheljs';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import type { OnFolderHierarchyResponseMailFolderPropsFragment } from './__generated__/onFolderHierarchyResponse.interface';

/**
 * Action for updating the folder store based on the GQL response for Folder Hierarchy Query.
 */
export const onFolderHierarchyResponse = action(
    'ON_QUERY_FOLDERHIERARCHY',
    (
        rootFolder: OnFolderHierarchyResponseMailFolderPropsFragment,
        folders: OnFolderHierarchyResponseMailFolderPropsFragment[],
        distinguishedFolderId: DistinguishedFolderIdName,
        principalSMTPAddress: string,
        displayName: string,
        folderTreeIdentifier: string,
        userIdentity?: string,
        includesLastItemInRange?: boolean,
        offset?: number
    ) => ({
        rootFolder,
        folders,
        distinguishedFolderId,
        principalSMTPAddress,
        displayName,
        folderTreeIdentifier,
        userIdentity,
        includesLastItemInRange,
        offset,
    })
);
