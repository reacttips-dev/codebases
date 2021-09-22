import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyUpdateUserConfigurationService } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getParseFolderViewStateWithSortConversionToString } from '../actions/folderViewStatesActions';
import getDefaultSearchScopeForFolderView from '../selectors/getDefaultSearchScopeForFolderView';
import { MailSortHelper } from 'owa-mail-list-store';
import { DEFAULT_LIST_VIEW_WIDTH } from 'owa-mail-layout/lib/mailLayoutConstants';
import getDefaultFolderView from '../selectors/getDefaultFolderView';
import { getFolderTable } from 'owa-folders';

export const VIEW_STATE_CONFIGURATION = 'OWA.ViewStateConfiguration';
export const USER_OPTIONS_CONFIGURATION: string = 'OWA.UserOptions';

const UPDATE_FOLDER_VIEW_STATE_DELAY_MS = 10 * 1000;

let updateFolderViewStateTimer: any = null;

/**
 * Delay update the folder view state service
 */
export default function updateFolderViewStateService() {
    const folderViewState = getUserConfiguration().ViewStateConfiguration?.FolderViewState;

    if (folderViewState) {
        const serializedFolderViewState: string[] = [];
        const defaultSortBy = MailSortHelper.getDefaultSortBy();

        for (let i = 0; i < folderViewState.length; i++) {
            // It is not necessary to store default view state on server, we are filtering folders with
            // default view state before updating server.
            if (isFeatureEnabled('fwk-skipDefaultViewState')) {
                const parsedFolderViewState = getParseFolderViewStateWithSortConversionToString(
                    folderViewState[i]
                );

                const mailFolder = getFolderTable().get(parsedFolderViewState.FolderId.Id);

                // Only consider IsExpanded for mail folder that has children. If the mail folder cannot be found
                // for any reason, we do not skip its state.
                const ignoreIsExpandedFromFolderViewState =
                    !!!mailFolder || mailFolder.hasChildren
                        ? !parsedFolderViewState.IsExpanded
                        : true;

                if (
                    ignoreIsExpandedFromFolderViewState &&
                    parsedFolderViewState.SearchScope ===
                        getDefaultSearchScopeForFolderView(parsedFolderViewState.FolderId.Id) &&
                    parsedFolderViewState.SortColumn === defaultSortBy.sortColumn &&
                    parsedFolderViewState.SortOrder === defaultSortBy.sortDirection &&
                    parsedFolderViewState.Width === DEFAULT_LIST_VIEW_WIDTH &&
                    parsedFolderViewState.ReadingPanePosition ===
                        getUserConfiguration().UserOptions?.GlobalReadingPanePositionReact &&
                    parsedFolderViewState.View ===
                        getDefaultFolderView(parsedFolderViewState.FolderId.Id)
                ) {
                    continue;
                }
            }

            serializedFolderViewState.push(folderViewState[i]);
        }

        // Save this changes with a timer so we can batch all of them together.
        if (!updateFolderViewStateTimer) {
            updateFolderViewStateTimer = setTimeout(function () {
                // Clear the time handle.
                updateFolderViewStateTimer = null;

                // Make the call.
                lazyUpdateUserConfigurationService.importAndExecute(
                    [
                        {
                            key: 'FolderViewState',
                            valuetype: 'StringArray',
                            value: serializedFolderViewState,
                        },
                    ],
                    VIEW_STATE_CONFIGURATION
                );
            }, UPDATE_FOLDER_VIEW_STATE_DELAY_MS);
        }
    }
}
