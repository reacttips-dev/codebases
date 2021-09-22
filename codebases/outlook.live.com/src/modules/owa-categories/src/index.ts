import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

export { getStore } from './store/store';
export { default as CategoryWell } from './components/CategoryWell';
export { default as Category } from './components/Category';
export { default as getCategoryColorsForCategory } from './utils/getCategoryColorsForCategory';
export { default as CategoryColor } from './store/schema/CategoryColor';

export { getCategoryMenuProps } from './utils/getCategoryMenuProps';
export { default as getCategorySuggestions } from './utils/getCategorySuggestions';
export { default as getMasterCategoryList } from './utils/getMasterCategoryList';
export type { default as CategoryActionSource } from './utils/CategoryActionSource';
export { getCategoryUnreadCount, getCategoryTotalCount } from './utils/getCategoryCounts';

export { default as isCategoryInMasterList } from './utils/isCategoryInMasterList';
export { getCategoryIdFromName, getCategoryNameFromId } from './utils/categoryIdNameConverter';
export { default as CategoryIcon } from './components/CategoryIcon';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Categories" */ './lazyIndex'));

export const lazyAddMasterCategories = new LazyAction(lazyModule, m => m.addMasterCategories);
export const lazyRemoveMasterCategories = new LazyAction(lazyModule, m => m.removeMasterCategories);
export const lazyChangeMasterCategories = new LazyAction(lazyModule, m => m.changeMasterCategories);
export const lazyUpdateLastTimeUsedMasterCategories = new LazyAction(
    lazyModule,
    m => m.updateLastTimeUsedMasterCategories
);
export const lazyGetMasterCategoriesList = new LazyAction(lazyModule, m => m.getMasterCategoryList);
export const lazySetInitialCategoryDialogViewState = new LazyAction(
    lazyModule,
    m => m.setInitialCategoryDialogViewState
);
export const lazyAddCategory = new LazyAction(lazyModule, m => m.addCategory);
export const lazyFetchCategoryDetails = new LazyAction(lazyModule, m => m.fetchCategoryDetails);
export const lazySubscribeToCategoryNotifications = new LazyAction(
    lazyModule,
    m => m.subscribeToCategoryNotifications
);
export const lazyApplyCategoryOperationHelper = new LazyAction(
    lazyModule,
    m => m.applyCategoryOperationHelper
);
export const lazySetBlockedCategoryNames = new LazyAction(
    lazyModule,
    m => m.setBlockedCategoryNames
);

export const lazyOnMenuDismissed = new LazyAction(lazyModule, m => m.onMenuDismissed);

export const CategoryMenu = createLazyComponent(lazyModule, m => m.CategoryMenu);
export const CategoryDialog = createLazyComponent(lazyModule, m => m.CategoryDialog);
export const CategoryColorPickerHost = createLazyComponent(
    lazyModule,
    m => m.CategoryColorPickerHost
);

export const lazyShowCategoryDialog = new LazyAction(lazyModule, m => m.showCategoryDialog);
export const CategoryMenuItem = createLazyComponent(lazyModule, m => m.CategoryMenuItem);
