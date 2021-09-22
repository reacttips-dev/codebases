import type ExtensionPointCollection from 'owa-service/lib/contract/ExtensionPointCollection';

/** This module is used (indirectly) by EnabledAddinCommands, which is currently impacts boot size */
export default function extensionPointCollectionSupportsSharedFolders(
    extensionPointCollection: ExtensionPointCollection
): boolean {
    if (!extensionPointCollection) {
        return false;
    }

    if ((extensionPointCollection as any).SupportsSharedFolders) {
        return true;
    } else {
        return false;
    }
}
