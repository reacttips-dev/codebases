interface OneDriveFilesStore {
    oneDriveFiles: OneDriveFileData[];
    loadState: FileLoadState;
}

export default OneDriveFilesStore;

export interface OneDriveFileData {
    fileName: string;
    lastOpened: string;
    isShared: boolean;
    url: string;
}

export enum FileLoadState {
    initialLoad,
    loading,
    loaded,
    loadFailed,
}
