import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { BlockOnSendAttachmentsStore } from './schema/BlockOnSendAttachmentsStore';
import type { BlockOnSendAttachmentsData } from './schema/BlockOnSendAttachmentsData';

const defaultStore: BlockOnSendAttachmentsStore = {
    BlockOnSendAttachments: new ObservableMap<string, BlockOnSendAttachmentsData>(),
};

export const getStore = createStore('blockOnSendAttachments', defaultStore);
