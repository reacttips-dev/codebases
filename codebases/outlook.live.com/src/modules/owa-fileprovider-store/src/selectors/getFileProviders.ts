import type FileProviderViewState from '../store/schema/FileProviderViewState';
import getStore from '../store/store';

const getFileProviders = (): FileProviderViewState[] => {
    return [...getStore().providers.values()];
};

const getFileProvider = (provider: string): FileProviderViewState | null => {
    return getStore().providers.get(provider) || null;
};

export { getFileProviders, getFileProvider };
