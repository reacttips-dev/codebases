import { getStore } from 'owa-options-store/lib/store/store';

export default function getOptionRouteState() {
    let store = getStore();

    return {
        isFullOptionsShown: store.isFullOptionsShown,
        areAllAllowedSubCategoriesLoaded: store.areAllAllowedSubCategoriesLoaded,
        currentCategoryKey: store.currentCategoryKey,
        currentSubCategoryKey: store.currentSubCategoryKey,
        currentOptionKey: store.currentOptionKey,
    };
}
