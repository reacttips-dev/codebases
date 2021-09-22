import getFolderViewStateFromId from '../selectors/getFolderViewStateFromId';
import updateFolderViewStateService from '../services/updateFolderViewStateService';
import { MailSortHelper, SortColumn } from 'owa-mail-list-store';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type SortDirection from 'owa-service/lib/contract/SortDirection';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfiguration } from 'owa-session-store/lib/actions/updateUserConfiguration';
import folderStore from 'owa-folders';
import type ReadingPanePosition from 'owa-session-store/lib/store/schema/ReadingPanePosition';
import getDefaultFolderView from '../selectors/getDefaultFolderView';
import getDefaultSearchScopeForFolderView from '../selectors/getDefaultSearchScopeForFolderView';
import { DEFAULT_LIST_VIEW_WIDTH } from 'owa-mail-layout/lib/mailLayoutConstants';
import type MailFolderNodeViewState from '../store/schema/MailFolderNodeViewState';

export enum SearchRefinerScopeType {
    SearchRefinerScopeAll = 0,
    SearchRefinerScopePrimaryMailbox = 1,
    SearchRefinerScopeCurrentFolder = 2,
    SearchRefinerScopeCurrentFolderAndSubfolders = 3,
}

export enum FolderView {
    ConversationView = 1,
    DateView = 2,
    DateViewOnly = 3,
    ItemGroupView = 4,
    BundledView = 5,
}

export interface FolderViewState {
    FolderId: FolderId;
    View: FolderView;
    Width: number;
    SortOrder: SortDirection;
    SortColumn: SortColumn;
    ReadingPanePosition: ReadingPanePosition;
    IsExpanded: boolean;
    SearchScope: SearchRefinerScopeType;
}

export function getParseFolderViewStateWithSortConversionToString(
    folderViewStateRaw: string
): FolderViewState {
    // The SortOrder is a enum flag - /sources/dev/store/src/Microsoft.Exchange.Mapi/sortorder.cs
    // where 0 is Ascending and 1 is Descending, so convert to client SortDirection type
    return JSON.parse(folderViewStateRaw, function (key, value) {
        if (key === 'SortOrder' && (value === 1 || value === 0)) {
            return value === 1
                ? MailSortHelper.DESCENDING_SORT_DIR
                : MailSortHelper.ASCENDING_SORT_DIR;
        }

        return value;
    }) as FolderViewState;
}

export function getFolderViewStatesFromUserConfig(): { [key: string]: FolderViewState } {
    const folderViewStatesFromUserConfig =
        getUserConfiguration().ViewStateConfiguration?.FolderViewState || [];
    const parsedFolderViewStates: { [key: string]: FolderViewState } = {};

    for (let i = 0; i < folderViewStatesFromUserConfig.length; i++) {
        const folderViewState = getParseFolderViewStateWithSortConversionToString(
            folderViewStatesFromUserConfig[i]
        );
        parsedFolderViewStates[folderViewState.FolderId.Id] = folderViewState;
    }

    return parsedFolderViewStates;
}

export function getFolderViewStateString(folderViewState: FolderViewState): string {
    return JSON.stringify(folderViewState, function (key, value) {
        if (
            key === 'SortOrder' &&
            (value === MailSortHelper.DESCENDING_SORT_DIR ||
                value === MailSortHelper.ASCENDING_SORT_DIR)
        ) {
            return value === MailSortHelper.DESCENDING_SORT_DIR ? 1 : 0;
        }

        return value;
    });
}
function getNewOrModifiedFolderViewState(
    folderId: string,
    userConfigurationFolderViewState: FolderViewState | null,
    folderViewStateFromStore: MailFolderNodeViewState | undefined
): FolderViewState | null {
    const sortOrder = folderViewStateFromStore ? folderViewStateFromStore.sortOrder : 'Ascending';
    const sortColumn = folderViewStateFromStore
        ? folderViewStateFromStore.sortColumn
        : SortColumn.Date;
    const isExpanded = folderViewStateFromStore ? folderViewStateFromStore.isExpanded : false;

    // If there is a userConfigurationFolderViewState, just get a version of the
    // FolderViewState based on that with the properties we want modified from the store
    if (userConfigurationFolderViewState) {
        return {
            ...userConfigurationFolderViewState,
            SortOrder: sortOrder,
            SortColumn: sortColumn,
            IsExpanded: isExpanded,
        } as FolderViewState;
    }

    // If not, just try to create a new FolderViewState with the right properties
    const folder = folderStore.folderTable.get(folderId);
    if (folder) {
        return {
            FolderId: folder.FolderId,
            View: getDefaultFolderView(folder.FolderId.Id),
            Width: DEFAULT_LIST_VIEW_WIDTH,
            // OWA uses 'sortColumn' is a rename of 'SortDirection'
            SortOrder: sortOrder,
            SortColumn: sortColumn,
            IsExpanded: isExpanded,
            ReadingPanePosition: getUserConfiguration().UserOptions?.GlobalReadingPanePositionReact,
            SearchScope: getDefaultSearchScopeForFolderView(folder.FolderId.Id),
        } as FolderViewState;
    }

    return null;
}
export function updateFolderViewState(folderId: string) {
    let isDirty: boolean = false;
    updateUserConfiguration(config => {
        const folderViewStatesFromUserConfig = config.ViewStateConfiguration?.FolderViewState || [];

        const folderViewStateFromStore = getFolderViewStateFromId(folderId);

        let existingUserConfigFolderViewState: FolderViewState | null = null;
        let index: number = -1;

        for (let i = 0; i < folderViewStatesFromUserConfig.length; i++) {
            const userConfigFolderViewState: FolderViewState = getParseFolderViewStateWithSortConversionToString(
                folderViewStatesFromUserConfig[i]
            );

            // Just save the index in case of an update
            if (userConfigFolderViewState.FolderId.Id === folderId) {
                existingUserConfigFolderViewState = userConfigFolderViewState;
                index = i;
                break;
            }
        }

        const folderViewStateToSave = getNewOrModifiedFolderViewState(
            folderId,
            existingUserConfigFolderViewState,
            folderViewStateFromStore
        );

        // If no folderViewStateToSave, just return
        if (!folderViewStateToSave) {
            return;
        }

        // If found, then update if any property does not match
        if (index !== -1) {
            // This will do a shallow compare which is enough,
            // since the FolderId which is the only complex type wont ever change
            isDirty = existingUserConfigFolderViewState !== folderViewStateToSave;
            // Update if it is dirty
            if (isDirty) {
                folderViewStatesFromUserConfig[index] = getFolderViewStateString(
                    folderViewStateToSave
                );
            }
        } else {
            // Need to save new view state configuration to user config
            isDirty = true;
            folderViewStatesFromUserConfig.push(getFolderViewStateString(folderViewStateToSave));
        }
    });

    if (isDirty) {
        updateFolderViewStateService();
    }
}
