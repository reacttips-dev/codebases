import type { FieldPolicy, FieldFunctionOptions } from '@apollo/client/cache';
import { getFoldersToShowFirst } from 'owa-folders-data-utils';
import type * as Schema from 'owa-graph-schema';
import { updateChildFolderIdsOnParent } from './updateChildFolderIdOnParent';

export const folderHierarchyTypePolicy: FieldPolicy = {
    keyArgs: ['baseFolderDistinguishedIds', 'mailboxInfo'],
    merge: (existing, incoming, options) => {
        const rootFolder = existing?.RootFolder || incoming.RootFolder;
        const allFolders = formParentChildRelationships(
            rootFolder,
            existing?.Folders || [],
            incoming?.Folders || [],
            options
        );

        return {
            RootFolder: rootFolder,
            Folders: allFolders,
            TotalItemsInView: incoming.TotalItemsInView,
            offset: incoming.offset,
            IncludesLastItemInRange: incoming.IncludesLastItemInRange,
            __typename: 'FolderHierarchyResult',
        };
    },
};

export function formParentChildRelationships(
    rootFolderRef: Schema.MailFolder | null,
    existingFolderRefs: Schema.MailFolder[],
    incomingFolderRefs: Schema.MailFolder[],
    options: FieldFunctionOptions
): Schema.MailFolder[] {
    if (!rootFolderRef) {
        return [];
    }

    const rootFolderId = options.readField<Schema.FolderId>('FolderId', rootFolderRef);
    if (!rootFolderId) {
        return [];
    }

    const folderRefMap: { [id: string]: Schema.MailFolder } = {};
    const parentFoldersToUpdate = new Map<string, string[]>();
    const folderNameIdMap: { [name: string]: string } = {};
    const folderIds: string[] = [];

    // Add root folder to map and id array
    folderRefMap[rootFolderId.Id] = rootFolderRef;
    folderIds.push(rootFolderId.Id);

    // Add existing folders to map for lookup
    existingFolderRefs.forEach(folderRef => {
        const folderId = options.readField<Schema.FolderId>('FolderId', folderRef);
        if (folderId) {
            folderRefMap[folderId.Id] = folderRef;
        }
    });

    // Add incoming folders to the map and id array
    incomingFolderRefs.forEach(folderRef => {
        const folderId = options.readField<Schema.FolderId>('FolderId', folderRef);
        if (folderId) {
            folderRefMap[folderId.Id] = folderRef;
            folderIds.push(folderId.Id);
        }
    });

    folderIds.forEach(folderId => {
        const folderRef = folderRefMap[folderId];
        const parentFolderId = options.readField<Schema.FolderId>('ParentFolderId', folderRef);
        const distinguishedFolderId = options.readField<string>('DistinguishedFolderId', folderRef);
        if (distinguishedFolderId) {
            folderNameIdMap[distinguishedFolderId] = folderId;
        }

        // Parent maybe already fetched and did not come as part of this request
        if (parentFolderId?.Id) {
            const parentId = parentFolderId.Id;
            const parentFolderRef = folderRefMap[parentId];

            if (parentFolderRef) {
                if (!parentFoldersToUpdate.get(parentId)) {
                    let existingChildFolderIds =
                        options.readField<string[]>('childFolderIds', parentFolderRef) || [];
                    parentFoldersToUpdate.set(parentId, [...existingChildFolderIds]);
                }

                const allChildFolderIds = parentFoldersToUpdate.get(parentId);
                if (allChildFolderIds && allChildFolderIds.indexOf(folderId) == -1) {
                    allChildFolderIds.push(folderId);
                }
            }
        }
    });

    parentFoldersToUpdate.forEach((value, key) => {
        updateChildFolderIdsOnParent(value /*newChildFolderIds*/, key /* parentId */, options);
    });

    // populate childIdsForRootFolder with wellknown folder ids first.
    let defaultChildIdsForRootFolder: string[] = [];
    const foldersToShowFirst = getFoldersToShowFirst();
    foldersToShowFirst.forEach(folderToShowFirstWellKnownName => {
        const wellknownFolderId = folderNameIdMap[folderToShowFirstWellKnownName];
        if (wellknownFolderId) {
            defaultChildIdsForRootFolder.push(wellknownFolderId);
        }
    });

    let rootChildFolderIds = options.readField<string[]>('childFolderIds', rootFolderRef) || [];
    let updateRootFolder;
    for (let i = 0; i < rootChildFolderIds.length; i++) {
        const id = rootChildFolderIds[i] || null;
        if (id && defaultChildIdsForRootFolder.indexOf(id) == -1) {
            defaultChildIdsForRootFolder.push(id);
            updateRootFolder = true;
        }
    }

    if (updateRootFolder) {
        updateChildFolderIdsOnParent(defaultChildIdsForRootFolder, rootFolderId.Id, options);
    }

    return [...existingFolderRefs, ...incomingFolderRefs];
}
