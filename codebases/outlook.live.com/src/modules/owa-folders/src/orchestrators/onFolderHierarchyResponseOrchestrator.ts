import type * as Schema from 'owa-graph-schema';
import { onFolderHierarchyResponse } from '../actions/onFolderHierarchyResponse';
import getFolderTable from '../selectors/getFolderTable';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import { setFolderTreeData } from '../mutators/setFolderTreeData';
import FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import { addFolderToDefaultFolderMappings } from 'owa-session-store';
import { orchestrator } from 'satcheljs';
import { createOrGetFolder } from './helpers/createOrGetFolder';
import { updateFolderTable } from './helpers/updateFolderTable';

/**
 * Orchestrator that updates the folder table and sets-up parent child folder relations
 * for gql folder hierarchy response.
 */
export const onFolderHierarchyResponseOrchestrator = orchestrator(
    onFolderHierarchyResponse,
    actionMessage => {
        const {
            displayName,
            folders,
            folderTreeIdentifier,
            includesLastItemInRange,
            offset,
            principalSMTPAddress,
            rootFolder,
            userIdentity,
        } = actionMessage;

        const createOrGetFolder_0 = (folder: Schema.MailFolder) => {
            return createOrGetFolder(folder, principalSMTPAddress);
        };

        updateFolderTable(displayName, rootFolder, folders, createOrGetFolder_0);

        setFolderTreeData(
            folderTreeIdentifier,
            getFolderTable().get(rootFolder.FolderId.Id),
            FolderTreeLoadStateEnum.Loaded,
            !includesLastItemInRange, // HasMoreData = !IncludesLastItemInRange
            offset,
            userIdentity
        );

        // We have seen instances of stale data in SessionSettings (DefaultFolder Names and Ids)
        // Replace the data with what FindFolder returns for folders with known names (DistinguishedFolderId names)
        if (rootFolder.mailboxInfo.type === 'UserMailbox') {
            for (let i = 0; i < folders.length; i++) {
                const rawFolder = folders[i];
                const folderId = rawFolder.FolderId.Id;
                const distinguishedFolderIdName = rawFolder.DistinguishedFolderId;

                if (!isStringNullOrWhiteSpace(distinguishedFolderIdName)) {
                    addFolderToDefaultFolderMappings(distinguishedFolderIdName, folderId);
                }
            }

            // Also update the rootFolder's folderNameToId mapping, to make sure we don't have stale entry for it
            // This especially required in case of Hx, where we update session data store with the folders data obtained from hx call
            addFolderToDefaultFolderMappings(
                rootFolder.DistinguishedFolderId,
                rootFolder.FolderId.Id
            );
        }
    }
);
