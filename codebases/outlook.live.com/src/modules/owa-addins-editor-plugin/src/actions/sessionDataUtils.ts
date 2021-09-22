import { mutatorAction } from 'satcheljs';
import type {
    AddinViewState,
    SessionStoreSchema,
} from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { ObservableMap } from 'mobx';

export const setComposeState = mutatorAction(
    'setComposeState',
    (
        viewState: AddinViewState,
        holder: SessionStoreSchema,
        key: string,
        value: string,
        sizeChange: number,
        guid: string
    ) => {
        holder.size += sizeChange;
        holder.dataStore.set(key, value);
        if (!viewState.sessionStore) {
            viewState.sessionStore = new ObservableMap<string, SessionStoreSchema>();
        }
        viewState.sessionStore.set(guid, holder);
    }
);

export const clearComposeState = mutatorAction(
    'clearComposeState',
    (viewState: AddinViewState, guid: string) => {
        const store = viewState.sessionStore;
        store.delete(guid);
    }
);

export const removeComposeState = mutatorAction(
    'removeComposeState',
    (viewState: AddinViewState, key: string, sizeChange: number, guid: string) => {
        const holder: SessionStoreSchema = viewState.sessionStore.get(guid);
        holder.size -= sizeChange;
        holder.dataStore.delete(key);
    }
);
