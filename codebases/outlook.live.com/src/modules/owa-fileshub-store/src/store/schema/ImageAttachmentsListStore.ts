import type { ObservableMap } from 'mobx';
import type { AttachmentModel } from 'owa-attachment-model-store';
import type { AttachmentFullViewState } from 'owa-attachment-well-data';
import AttachmentItemsSortBy from 'owa-service/lib/contract/AttachmentItemsSortBy';
import type ModernAttachment from 'owa-service/lib/contract/ModernAttachment';

export enum ImageListViewType {
    SmallTile,
    LargeTile,
    DetailsList,
}

/*
    THESE CONSTS ARE DEFINED ON THE SERVER. ANY CHANGE TO THESE
    HAVE AN IMPACT ON HOW WE WARMUP THE FILES FOLDER ON 1ST EXPERIENCE.
    IF ANYTHING CHANGES ON THESE VALUES THEN A CHANGE IS NEEDED AT
    Utah1\sources\dev\data\src\ApplicationLogic\Server\DefaultViewIndexer\PhotoHubFlightConfiguration.cs AND
    Utah1\sources\dev\data\src\ApplicationLogic\Server\DefaultViewIndexer\FilesHubFlightConfiguration.cs
*/

// Default image size
export const DEFAULT_IMAGE_SIZE: number = 50000;

// Default sorting
export const DEFAULT_SORTING =
    AttachmentItemsSortBy.AttachmentReceivedTime | AttachmentItemsSortBy.DescendingOrder;

export interface AttachmentListStateProps {
    message: string;
    icon: string;
}

export const enum ImageListViewState {
    InitialLoading, // Whenever we are loading the listview with no results yet
    MoreRowsLoading, // Whenever we are loading more rows of an existing listview with items
    Loaded, // Whenever we have finished loading (after InitialLoading or MoreRowsLoading) and have items
    Empty, // Whenever we have finished loading (after InitialLoading) and have NO items
    Error, // Whenever there is an error fetching images to display
    Sorting,
    Searching,
    SearchLoaded,
    EmptySearch,
}

export const enum AttachmentMetadataItemType {
    CameraMake,
    Dimensions,
    UnresolvedLocation,
    ResolvedLocation,
    DateCreated,
    Orientation,
    ShotSettings,
    Size,
    Type,
}

export interface AttachmentMetadataItem {
    type: AttachmentMetadataItemType;
    displayName: string;
    displayValue: string;
}

export interface AttachmentData {
    model: ModernAttachment;
    attachment: AttachmentModel;
    viewState: AttachmentFullViewState;
    thumbnailImageFallbackExecuted: boolean; // This flag indicates if the fallback logic for thumbnail image in case of failure was executed or not
    metadata?: AttachmentMetadataItem[];
    primaryText?: string;
    secondaryText?: string;
    previewText?: string;
    headerDate?: Date;
    providerLinkUrl?: string;
}

interface ImageAttachmentsListStore {
    imageAttachments: ObservableMap<string, AttachmentData>;
    imageAttachmentsIds: string[];
    imageListState: ImageListViewState;
    selectedPhotoIndex?: number;
    currentLoadedIndex: number;
    currentNumberOfImagesInView: number;
    currentSorting: AttachmentItemsSortBy;
    moreResultsAvailable: boolean;
    nextPageToken: string;
    selectedAttachmentsIds: ObservableMap<string, string>;
    currentViewOption: ImageListViewType;
    isPreviewPaneShown: boolean;
    isInfoPaneShown: boolean;
    sessionId?: string;
}

export default ImageAttachmentsListStore;
