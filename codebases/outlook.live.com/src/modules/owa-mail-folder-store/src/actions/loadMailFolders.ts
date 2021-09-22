import { FolderViewState, getFolderViewStatesFromUserConfig } from './folderViewStatesActions';
import getSortByFolderId from '../selectors/getSortByFolderId';
import createDragViewState from 'owa-dnd/lib/utils/createDragViewState';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import setFolderViewState from './setFolderViewState';
import type MailFolderNodeViewState from '../store/schema/MailFolderNodeViewState';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    getPrimaryMailFolders,
    initializeArchiveFolderTreeFromSessionData,
    initializeSharedFolderRoots,
} from 'owa-folders';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type { SessionData } from 'owa-service/lib/types/SessionData';

function isFolderExpanded(
    parsedFolderViewStates: { [key: string]: FolderViewState },
    folderId: string
): boolean {
    if (folderId == folderNameToId('msgfolderroot')) {
        // If the folder is the root folder, use UserOptions.IsMailRootFolderTreeCollapsed.
        return !getUserConfiguration().UserOptions?.IsMailRootFolderTreeCollapsed;
    } else {
        // If we do not have a viewstate for this folder consider it expanded.
        const folderViewState: FolderViewState = parsedFolderViewStates[folderId];
        return !folderViewState || folderViewState.IsExpanded;
    }
}

function initializeMailFolderViewStates() {
    const sessionDataViewStates = getFolderViewStatesFromUserConfig();
    Object.keys(sessionDataViewStates).forEach(folderId => {
        const { sortColumn, sortDirection } = getSortByFolderId(folderId);
        const mailFolderViewState: MailFolderNodeViewState = {
            isExpanded: isFolderExpanded(sessionDataViewStates, folderId),
            sortColumn: sortColumn,
            sortOrder: sortDirection,
            drag: createDragViewState(),
            drop: createDropViewState(),
        };
        setFolderViewState(folderId, mailFolderViewState);
    });
}

export default async function loadMailFolders(sessionData?: SessionData) {
    // populate folder store
    await getPrimaryMailFolders(undefined, undefined, sessionData);

    // raise an action to initialize archive mailbox.
    // initialize shared folders
    if (!isConsumer()) {
        if (getUserConfiguration().SessionSettings?.HasArchive) {
            initializeArchiveFolderTreeFromSessionData();
        }
        initializeSharedFolderRoots();
    }

    initializeMailFolderViewStates();
}
