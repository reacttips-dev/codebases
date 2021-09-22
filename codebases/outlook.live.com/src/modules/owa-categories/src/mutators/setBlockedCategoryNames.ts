import { mutatorAction } from 'satcheljs';
import categoryStore from '../store/store';

export default mutatorAction(
    'setBlockedCategoryNames',
    function setBlockedCategoryNames(categoryNames: string[], shouldBlockNames: boolean) {
        if (shouldBlockNames) {
            // Add names to blocked list
            categoryStore.blockedCategoryNames = categoryStore.blockedCategoryNames.concat(
                categoryNames
            );
        } else {
            // Remove names from blocked list
            for (const categoryName of categoryNames) {
                const index = categoryStore.blockedCategoryNames.indexOf(categoryName);
                if (index > -1) {
                    categoryStore.blockedCategoryNames.splice(index, 1);
                }
            }
        }
    }
);
