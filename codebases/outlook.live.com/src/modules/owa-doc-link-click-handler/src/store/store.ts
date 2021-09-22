import type SharePointDocLinkPreviewStore from './schema/SharePointDocLinkPreviewStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const defaultStore: SharePointDocLinkPreviewStore = {
    activeGetWacInfoOperations: [],
    getWacInfoQueue: [],
    suppressedUrls: [],
    docLinkPreviewInfoMap: new ObservableMap(),
};

export const getStore = createStore<SharePointDocLinkPreviewStore>(
    'sharePointDocLinkPreview',
    defaultStore
);
export default getStore();
