import {
    FolderViewState,
    getFolderViewStatesFromUserConfig,
} from '../actions/folderViewStatesActions';
import { MailSortHelper, SortBy } from 'owa-mail-list-store';
import { getSupportedSortColumns } from 'owa-mail-list-store/lib/utils/sort/mailSortHelper';
import { logUsage } from 'owa-analytics';

export default function getSortByFolderId(folderId: string): SortBy {
    const sessionDataViewStates = getFolderViewStatesFromUserConfig();
    const folderViewState: FolderViewState = sessionDataViewStates[folderId];

    // If we do not have a viewstate for this folder, use the sort column / order default.
    if (folderViewState) {
        const supportedSortColumns = getSupportedSortColumns(folderId);
        const { SortColumn, SortOrder } = folderViewState;
        // Use sort column given by folder view state only if we support it in React. Otherwise, use default.
        if (supportedSortColumns.includes(SortColumn)) {
            let updatesSortOrder = SortOrder;

            if (
                !SortOrder ||
                (SortOrder != MailSortHelper.DESCENDING_SORT_DIR &&
                    SortOrder != MailSortHelper.ASCENDING_SORT_DIR)
            ) {
                // Folder view state parsing only returns valid values for Ascending (0) and Descending (1) values.
                // In the service, sort direction is a Flag property that also supports CategoryMax (0x4) and Min (0x8).
                // So any values other than 0x0 and 0x1 (including null) will result in invalid SortBy data.
                // Applying the fix here instead of in getParseFolderViewStateWithSortConversionToString
                // because getDefaultSortDirectionForSortColumn can throw exceptions and I wanted to
                // avoid that happening during userconfig parsing.
                updatesSortOrder = MailSortHelper.getDefaultSortDirectionForSortColumn(SortColumn);

                logUsage('getSortByFolderId_invalidSortOrder', {
                    sortColumn: SortColumn,
                    sortOrder: SortOrder,
                });
            }
            return { sortColumn: SortColumn, sortDirection: updatesSortOrder };
        }
    }

    return MailSortHelper.getDefaultSortBy();
}
