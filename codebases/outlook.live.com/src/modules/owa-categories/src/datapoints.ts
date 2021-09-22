import type CategoryActionSource from './utils/CategoryActionSource';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import { DEFAULT_NEW_CATEGORY_COLOR_CODE } from './utils/categoriesConstants';

export default {
    //#region actionDatapoints
    addMasterCategories: {
        name: 'Category_AddMasterCategories',
        customData: (categoriesToAdd: CategoryType[], actionSource: CategoryActionSource) => [
            actionSource, // CategoriesOptions, NewCategoryButton, SearchCategoryCreateNew, Rules, etc
            categoriesToAdd[0].Color != DEFAULT_NEW_CATEGORY_COLOR_CODE, // Whether user chooses a color when creating a new category
        ],
    },
    removeMasterCategories: {
        name: 'Category_RemoveMasterCategories',
        customData: (categoriesToRemove: string[], actionSource: CategoryActionSource) => [
            actionSource,
        ],
    },
    changeMasterCategories: {
        name: 'Category_ChangeMasterCategories',
        customData: (categoriesToChange: CategoryType[], actionSource: CategoryActionSource) => [
            actionSource,
        ],
    },
    renameMasterCategories: {
        name: 'Category_RenameMasterCategories',
        customData: (
            categoriesToAdd: CategoryType[],
            categoriesToRemove: string[],
            actionSource: CategoryActionSource
        ) => [actionSource],
    },
    //#endregion
};
