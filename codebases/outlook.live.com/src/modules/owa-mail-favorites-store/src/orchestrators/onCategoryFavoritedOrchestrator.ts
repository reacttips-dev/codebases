import * as pendingFavoritesMapMutators from '../mutators/pendingFavoritesMapMutators';
import { onCategoryFavorited } from 'owa-favorites';
import { loadInitialRowsFromServer } from 'owa-mail-list-actions';
import createMailCategoryFolderTableQuery from 'owa-mail-triage-table-utils/lib/createMailCategoryFolderTableQuery';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';
import { orchestrator } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';

export default orchestrator(onCategoryFavorited, actionMessage => {
    const { categoryId } = actionMessage;

    // Add the category id to the pending favorites map to track if the favorites is in progress
    pendingFavoritesMapMutators.add(categoryId);

    // Set up the category search folder right after favoriting completes.
    // With this we are prepping the search folder with the hope that it is ready when user clicks on the folder.
    prepareCategorySearchFolder(categoryId);
});

function prepareCategorySearchFolder(categoryId: string) {
    // Load the category table to setup the search folder in the back
    const tableQuery = createMailCategoryFolderTableQuery(categoryId);
    const tableView = getTableViewFromTableQuery(tableQuery, true /* skipAddToStore */);

    loadInitialRowsFromServer(
        tableView,
        false /* isTablePrefetched */,
        (
            tableView: TableView,
            isSuccessResponseClass: boolean,
            responseCode: string,
            isTablePrefetched: boolean
        ) => onCategorySearchTableLoadComplete(categoryId)
    );
}

function onCategorySearchTableLoadComplete(categoryId: string) {
    // Remove the favorite from the pending map when we get a response from the server.
    // We want to do it when the searc folder creation succeeds/fails/with errors, so that the user click will trigger
    // FindConversation/FindItem in the same session.
    pendingFavoritesMapMutators.remove(categoryId);
}
