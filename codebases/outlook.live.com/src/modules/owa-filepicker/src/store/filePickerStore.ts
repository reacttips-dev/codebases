import AttachmentItemsFilterBy from 'owa-service/lib/contract/AttachmentItemsFilterBy';
import type FilePickerStore from './schema/FilePickerStore';
import { createStore } from 'satcheljs';
import { FilePickerPreloadState } from './schema/FilePickerPreloadState';
import { FileProvidersFilter } from './schema/FileProvidersFilter';
import { FilePickerViewType } from '../types/FilePickerViewSwitcher';
import { FileSelectionFilter } from 'owa-fileprovider-store';
import { ComposeUniqueState } from '../store/schema/FilePickerUploadConfiguration';

const filePickerStoreData: FilePickerStore = {
    viewState: {
        isOpen: false,
        preloadState: FilePickerPreloadState.NotLoaded,
        fileSelectionFilter: FileSelectionFilter.None,
        fileProvidersFilter: FileProvidersFilter.None,
        selectedFileProvider: null,
        selectedProviderScope: null,
        filePickerViewState: {
            breadcrumbs: [],
            columnSorting: null,
            fileProviderItems: [],
            isLoadingItems: false,
            pagingMetadata: null,
            selectedFileProviderItems: [],
            selectedFolder: null,
            selectedView: null,
            supportedActions: [],
            supportedActionsMessages: [],
            supportedViews: [],
            totalItemsCount: 0,
            userPreferredViewType: FilePickerViewType.List,
            searchViewState: {
                searchQuery: '',
                isInSearchMode: false,
            },
            filterOptionsState: {
                showFilterOptions: false,
                selectedFilterOption: AttachmentItemsFilterBy.None,
            },
        },
        filePickerErrorMessageViewState: {
            isShown: false,
            message: null,
        },
        filePickerActionsViewState: {
            isOpen: false,
            saveUserChoice: false, // related to the "remember my choice" checkbox in the actions panel
            isCalloutVisible: false, // callout for the checkbox
            uploadConfiguration: {
                composeUniqueState: ComposeUniqueState.None,
            },
        },
        showFileProviderInlineView: false,
    },
};

const getFilePickerStore = createStore<FilePickerStore>('filepicker', filePickerStoreData);
export { getFilePickerStore };
