import type ComposeLinkViewStore from './schema/ComposeLinkViewStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const composeLinkViewStore: ComposeLinkViewStore = {
    composeLinks: new ObservableMap({}),
    selectedLinkId: null,
    isSelectedLinkReadOnly: null,
};

export const getStore = createStore<ComposeLinkViewStore>(
    'composeLinkViewStore',
    composeLinkViewStore
);
export default getStore;
