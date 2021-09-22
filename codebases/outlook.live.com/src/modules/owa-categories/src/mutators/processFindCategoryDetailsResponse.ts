import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';
import type FindCategoryDetailsResponseMessage from 'owa-service/lib/contract/FindCategoryDetailsResponseMessage';
import type CategoryDetails from 'owa-service/lib/contract/CategoryDetails';

export default mutatorAction(
    'processFindCategoryDetailsResponse',
    function processFindCategoryDetailsResponse(response: FindCategoryDetailsResponseMessage) {
        getStore().isSearchFolderReady = response.IsSearchFolderReady;

        response.CategoryDetailsList.forEach((category: CategoryDetails) => {
            getStore().categoryDetails.set(category.Category, {
                unreadCount: category.UnreadCount,
                totalCount: category.ItemCount,
            });
        });
    }
);
