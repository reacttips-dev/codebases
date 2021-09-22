import type AttachmentStore from './schema/AttachmentStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const attachmentStore: AttachmentStore = {
    attachments: new ObservableMap({}),
};

export const getStore = createStore<AttachmentStore>('attachment', attachmentStore);
export default getStore;
