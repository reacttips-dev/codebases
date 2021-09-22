import type { IObjectWithKey } from '@fluentui/react/lib';
import type { OwaDate } from 'owa-datetime';
import type AttachmentDataProviderItem from 'owa-service/lib/contract/AttachmentDataProviderItem';
import type OneDriveProGroupsPagingMetadata from 'owa-service/lib/contract/OneDriveProGroupsPagingMetadata';

export enum FileProviderItemType {
    File,
    Folder,
    Group,
}

export const enum ImageLoadState {
    NotLoaded,
    Loaded,
    ErrorLoading,
}

export const enum GroupCategory {
    Favorite,
    Joined,
    Other,
}

export interface ImageInfo {
    url: string;
    width: number;
    height: number;
    loadState: ImageLoadState;
}

export interface FileProviderItemViewState extends IObjectWithKey {
    type: FileProviderItemType;
    key: string;
    name: string;
    location: string;
    modifiedTime: OwaDate | null;
    modifiedBy: string;
    sharedBy: string;
    sharedTime: OwaDate | null;
    from: string;
    subject: string;
    receivedDate: OwaDate | null;
    model: AttachmentDataProviderItem;
    thumbnail?: ImageInfo;
}

export interface FileItemViewState extends FileProviderItemViewState {
    type: FileProviderItemType.File;
    sizeDisplayString: string;
}

export interface FolderItemViewState extends FileProviderItemViewState {
    type: FileProviderItemType.Folder;
    childCount: number;
}

export interface GroupItemViewState extends FileProviderItemViewState {
    type: FileProviderItemType.Group;
    pagingMetadata: OneDriveProGroupsPagingMetadata;
    joinDate: OwaDate | null;
    groupCategory: GroupCategory;
}

export default FileProviderItemViewState;
