import type PhotoHubStore from './schema/PhotoHubStore';
import { FileExtensionType } from 'owa-files-filter-file-extensions-filter';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';
import {
    ImageListViewType,
    AttachmentData,
    DEFAULT_SORTING,
    ImageListViewState,
} from './schema/ImageAttachmentsListStore';
import { FileLoadState } from './schema/OneDriveFilesStore';

const photoHubStoreData: PhotoHubStore = {
    imageAttachmentsListStore: {
        imageAttachments: new ObservableMap<string, AttachmentData>({}),
        imageAttachmentsIds: [],
        selectedPhotoIndex: null,
        selectedAttachmentsIds: new ObservableMap<string, string>({}),
        imageListState: ImageListViewState.InitialLoading,
        currentLoadedIndex: 0,
        currentNumberOfImagesInView: 0,
        moreResultsAvailable: true,
        nextPageToken: null,
        currentViewOption: ImageListViewType.SmallTile,
        isPreviewPaneShown: false,
        isInfoPaneShown: false,
        currentSorting: DEFAULT_SORTING,
    },
    providersViewState: {
        isProviderPanelExpanded: true,
    },

    attachmentListFilterStateViewState: {
        isExtensionFilterExpanded: false,
        isFilterMenuOpen: false,
    },
    // The order of the options properties matter since it is how the UI is going to be built
    attachmentListFilterState: {
        extensionGroupFilter: {
            selectedValue: new ObservableMap<string, string>({}),
        },
        broadExtensionGroupFilter: {
            selectedValue: FileExtensionType.Files,
            options: [FileExtensionType.Files, FileExtensionType.Images], // order matters
        },
        dateRangeFilter: {
            selectedValue: { option: null, dateRange: null },
        },
        folderFilter: { selectedValue: null },
        photosOnlyFilter: { selectedValue: false },
        senderFilter: { selectedValue: null },
        sizeFilter: {
            selectedValue: null,
            options: [512000, 1048576, 3072000, 5242880, 10485760], // sizes in bytes - order matters
        },
        searchFilter: { selectedValue: null }, // Will be a querystring that combines text/persona data for the SearchAPI
        linksOnly: { selectedValue: false },
    },

    recommendedAttachmentsStore: {
        recommendedAttachments: new ObservableMap<string, AttachmentData>({}),
        recommendedAttachmentsIds: [],
        selectedAttachmentsIds: new ObservableMap<string, string>({}),
    },

    sortState: {
        isSortMenuHidden: true,
        sortMenuPoint: null,
        isSorted: false,
        isCurrentSortingDescending: false,
        sortColumn: null,
    },

    // Although it would be easy to move this into a local store in the OfficeTemplates package,
    // I am leaving it here, since in the near future we will likely fetch templates from Office
    // instead of using cached info for them. Then this store will follow the same pattern as
    // oneDriveFilesStore below, with a similar service call to load the files.
    officeTemplatesStore: {
        isContextMenuOpen: false,
    },

    oneDriveFilesStore: {
        oneDriveFiles: [],
        loadState: FileLoadState.initialLoad,
    },

    headers: new Map<string, string>(),
    isLoaded: false,
    viewSelectionMade: false,
};

export const getStore = createStore<PhotoHubStore>('photoHub', photoHubStoreData);
const store = getStore();
export default store;
