import type SharingLinkStore from './schema/SharingLinkStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const sharingLinkStore: SharingLinkStore = {
    sharingLinks: new ObservableMap({}),
    linksIdContainerMap: new ObservableMap({}),
};

export const getStore = createStore<SharingLinkStore>('sharingLinkStore', sharingLinkStore);
export default getStore;
