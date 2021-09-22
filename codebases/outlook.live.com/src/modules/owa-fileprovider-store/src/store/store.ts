import type FileProviderStore from './schema/FileProviderStore';
import type FileProviderViewState from './schema/FileProviderViewState';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import { ProviderLoadStateOption } from './schema/ProviderLoadStateOption';

const providerStoreData: FileProviderStore = {
    providers: new ObservableMap<string, FileProviderViewState>(),
    loadState: ProviderLoadStateOption.NotLoaded,
    removalPending: new ObservableMap<string, string>(),
};

const getStore = createStore<FileProviderStore>('fileProviderStore', providerStoreData);
export default getStore;
