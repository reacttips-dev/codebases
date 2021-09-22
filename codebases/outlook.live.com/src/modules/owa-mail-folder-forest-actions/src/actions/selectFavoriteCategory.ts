import datapoints from './datapoints';
import onAfterSelectingNode from './helpers/onAfterSelectingNode';
import selectDefaultFolder from './selectDefaultFolder';
import { getCategoryNameFromId, getMasterCategoryList } from 'owa-categories';
import selectNodeInFolderForest from './selectNodeInFolderForest';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    addFrequentlyUsedFolder,
    FilteredFolderFilterProperties,
    FILTER_FOLDER_ID_BUILDER,
} from 'owa-mail-frequently-used-folders';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import { getFavoriteIdFromCategoryId, getStore as getSharedFavoritesStore } from 'owa-favorites';
import { FolderForestNode, FolderForestNodeType, FavoriteCategoryData } from 'owa-favorites-types';

/**
 * Select a favorite category node
 * @param categoryId the category guid
 */
export default wrapFunctionForDatapoint(
    datapoints.selectFavoriteCategory,
    function selectFavoriteCategory(categoryId: string) {
        let selectNodePromise: Promise<void>;

        // Only perform the rest of selecting folder logic when
        // user navigates to a folder with the different folderId
        if (categoryId != getSelectedNode().id) {
            let categoryNodeToSelect: FolderForestNode;
            if (isFeatureEnabled('tri-favorites-roaming')) {
                const favoriteId = getFavoriteIdFromCategoryId(categoryId);
                const categoryData = getSharedFavoritesStore().outlookFavorites.get(
                    favoriteId
                ) as FavoriteCategoryData;

                // The favorited category node may have been unfavorited, such as user exiting search and trying to
                // get to previous node, or backstacking etc. where the node may not be present if user unfavorited it
                // in which case select the default folder
                if (!categoryData) {
                    selectDefaultFolder('ResetInbox');
                    return Promise.resolve();
                }

                categoryNodeToSelect = {
                    id: categoryData.categoryId,
                    treeType: categoryData.treeType,
                    type: FolderForestNodeType.Category,
                };
            } else {
                categoryNodeToSelect = getSharedFavoritesStore().favoriteCategories.get(categoryId);
            }

            selectNodePromise = selectNodeInFolderForest(categoryNodeToSelect);

            // Add category information to the frequently used folder list
            const categoryName = getCategoryNameFromId(categoryId, getMasterCategoryList());
            const categoryFolderIdToAddToFUF = getFilteredFolderId({
                filterType: 'UserCategory',
                filterValue: categoryName,
            });
            addFrequentlyUsedFolder(categoryFolderIdToAddToFUF);
        }

        // Called after selecting same/different persona
        // #15945 - We should try to merge SelectFolder, SelectPersona, SelectGroup logic and move this method into a common place
        onAfterSelectingNode();
        return selectNodePromise;
    }
);

/**
 * Gets the filteredFolderId given the filterType and filterValue
 * @param filterFolderFilterProps required to form the filtered folder id
 * @return the folder id for the filtered folder in the folderType#folderValue format
 * E.g. for a category folder filter the viewfilter is "UserCategory" and filter value is category name
 * So in case of category folder the filtered folder id will be "UserCategory#foo"
 */
function getFilteredFolderId(filterFolderFilterProps: FilteredFolderFilterProperties) {
    if (filterFolderFilterProps.filterType != 'UserCategory') {
        throw new Error(
            "getFilteredFolderId should only be called for 'UserCategory' viewfilter type"
        );
    }

    return (
        filterFolderFilterProps.filterType +
        FILTER_FOLDER_ID_BUILDER +
        filterFolderFilterProps.filterValue
    );
}
