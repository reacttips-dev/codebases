import type ItemQueryTraversal from 'owa-service/lib/contract/ItemQueryTraversal';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';

/**
 * Gets the traversal based on the view filter
 * @param viewFilter The view filter for which to get the traversal
 * @returns a traversal of type ItemQueryTraversal
 */
export function getFindItemTraversal(viewFilter: ViewFilter): ItemQueryTraversal {
    switch (viewFilter) {
        case 'Hashtag':
        case 'UserCategory':
            return 'SoftDeleted'; // A SoftDeleted Traversal means to fetch items from the root folder and all the sub folders

        default:
            return 'Shallow';
    }
}
