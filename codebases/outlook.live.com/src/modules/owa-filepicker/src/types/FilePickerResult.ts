import type FilePickerAction from '../store/schema/FilePickerAction';
import type FileProviderItemViewState from '../store/schema/FileProviderItemViewState';

export enum SelectedFilesSource {
    LocalComputerFiles,
    ProviderFiles,
}

interface FilePickerResult {
    files: File[] | FileProviderItemViewState[];
    source: SelectedFilesSource;
    action: FilePickerAction;
    supportsInsertLink: boolean;
}

export default FilePickerResult;
