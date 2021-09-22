import getColorCodeColorValueMap from './helpers/getColorCodeColorValueMap';
import type CategoryStore from './schema/CategoryStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type CategoryDetails from './schema/CategoryDetails';

let defaultCategoryStore = {
    categoryIdToNameMap: {},
    categoryMenuViewState: {
        findText: '',
        isFocusInSearchBox: false,
        shouldShowAllCategories: false,
    },
    categoryColorPickerViewState: {
        colorPickerTarget: null,
        shouldShowColorPicker: false,
    },
    colorCodeColorValueMap: getColorCodeColorValueMap(),
    pendingCategoryNamesMap: {},
    categoryDetails: new ObservableMap<string, CategoryDetails>({}),
    isSearchFolderReady: false,
    categoryDialogViewState: null,
    isApplyingCategoryOperation: false,
    blockedCategoryNames: [],
};

export const getStore = createStore<CategoryStore>('category', defaultCategoryStore);
export default getStore();
