import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';
import type OptionsViewState from './schema/OptionsViewState';

export const getStore = createStore<OptionsViewState>('optionsViewState', {
    isFullOptionsShown: false,
    areAllAllowedSubCategoriesLoaded: false,
    isSaving: false,
    currentCategoryKey: null,
    currentSubCategoryKey: null,
    subCategoryLoadState: new ObservableMap(),
    currentOptionKey: null,
    allowedOptions: [],
    dirtyOptions: [],
});
