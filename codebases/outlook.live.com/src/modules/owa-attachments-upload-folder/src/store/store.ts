import type { AttachmentsUploadFolderStore } from './schema/AttachmentsUploadFolderStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { UploadFolder } from './schema/UploadFolder';

const defaultStore: AttachmentsUploadFolderStore = {
    uploadFolders: new ObservableMap<string, UploadFolder>(),
};

export const getStore = createStore('attachmentsUploadFolderStore', defaultStore);
