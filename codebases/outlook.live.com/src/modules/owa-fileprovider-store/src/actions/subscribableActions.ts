import type FileProviderViewState from '../store/schema/FileProviderViewState';
import { action } from 'satcheljs';
import type { FileProviderType } from '../utils/constants';

// Subscribe to these methods to make changes to another store when providers are added/ removed
// Example: When a fileprovider is added in the options settings panel, if the filepicker orchestrator is registered
// this will trigger a change in the selected fileprivder in the filepicker

const fileProviderAdded = action(
    'FILE_PROVIDER_ADDED',
    (providerViewState: FileProviderViewState) => ({
        providerViewState: providerViewState,
    })
);

const fileProviderRemoved = action('FILE_PROVIDER_REMOVED', (providerType: FileProviderType) => ({
    providerType: providerType,
}));

const providersLoaded = action('PROVIDERS_LOADED', (providers: FileProviderViewState[]) => ({
    providers: providers,
}));

export { fileProviderRemoved, fileProviderAdded, providersLoaded };
export { default as AttachmentDataProviderType } from 'owa-service/lib/contract/AttachmentDataProviderType';
