import { action } from 'satcheljs';
import type { CategoryOperation } from '../store/schema/CategoryDialogViewState';

/**
 * Sets the initial state of category dialog view state
 */
export default action(
    'setInitialCategoryDialogViewState',
    (
        operation: CategoryOperation,
        initialCategoryName?: string,
        colorId?: string,
        isFavorite?: boolean
    ) => ({
        operation,
        initialCategoryName,
        colorId,
        isFavorite,
    })
);
