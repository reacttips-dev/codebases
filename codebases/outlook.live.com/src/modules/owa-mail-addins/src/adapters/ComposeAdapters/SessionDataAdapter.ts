import type { ComposeViewState } from 'owa-mail-compose-store';
import {
    setComposeState,
    clearComposeState,
    removeComposeState,
} from 'owa-addins-editor-plugin/lib/actions/sessionDataUtils';
import { ApiErrorCode } from 'owa-addins-core';
import type { SessionStoreSchema } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { ObservableMap } from 'mobx';

//Maximum permissible size for all key + value pairs, given any addin
const SESSION_DATA_MAX_SIZE: number = 50000;

export const setSessionDataState = (viewState: ComposeViewState) => (
    key: string,
    value: string,
    guid: string
): void => {
    let holder: SessionStoreSchema;
    let sizeChange = 0;
    if (viewState.addin.sessionStore?.has(guid)) {
        holder = viewState.addin.sessionStore.get(guid);
        if (holder.dataStore.has(key)) {
            //if the key already exists, we replace it with current value
            sizeChange -= byteSize(key) + byteSize(holder.dataStore.get(key));
        }
    } else {
        holder = {
            size: 0,
            dataStore: new ObservableMap<string, string>(),
        };
    }

    const currentPairSize = byteSize(key) + byteSize(value);
    sizeChange += currentPairSize;

    //We make sure the size limit isn't crossed, after each insertion/updation
    if (holder.size + sizeChange > SESSION_DATA_MAX_SIZE) {
        throw ApiErrorCode.SessionDataObjectMaxLengthExceeded;
    }
    setComposeState(viewState.addin, holder, key, value, sizeChange, guid);
};

export const getSessionDataState = (viewState: ComposeViewState) => (
    key: string,
    guid: string
): string => {
    if (viewState.addin.sessionStore?.has(guid)) {
        const holder: SessionStoreSchema = viewState.addin.sessionStore.get(guid);
        if (holder.dataStore.has(key)) {
            return holder.dataStore.get(key);
        }
    }
    throw ApiErrorCode.KeyNotFound;
};

export const getAllSessionDataState = (viewState: ComposeViewState) => (guid: string) => {
    const store = viewState.addin.sessionStore;
    return store.has(guid) && store.get(guid).size > 0
        ? store.get(guid).dataStore
        : JSON.stringify(new ObservableMap<string, string>());
};

export const clearSessionDataState = (viewState: ComposeViewState) => (guid: string): void => {
    if (viewState.addin.sessionStore?.has(guid)) {
        clearComposeState(viewState.addin, guid);
    }
};

export const removeSessionDataState = (viewState: ComposeViewState) => (
    key: string,
    guid: string
): void => {
    if (viewState.addin.sessionStore?.has(guid)) {
        const holder: SessionStoreSchema = viewState.addin.sessionStore.get(guid);
        if (holder.dataStore.has(key)) {
            //We remove the size of the element from total size
            const sizeChange = byteSize(key) + byteSize(holder.dataStore.get(key));
            removeComposeState(viewState.addin, key, sizeChange, guid);
            return;
        }
    }
    throw ApiErrorCode.KeyNotFound;
};

const byteSize = (str: string): number => new Blob([str]).size;
