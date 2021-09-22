import extensionPointCollectionSupportsSharedFolders from './extensionPointCollectionSupportsSharedFolders';
import type IAddin from '../store/schema/interfaces/IAddin';

/** This module is used by EnabledAddinCommands, which is currently impacts boot size */
export function filterSupportsSharedFolderAddins(addins: IAddin[]): IAddin[] {
    return addins.filter(addin => {
        const extensionPointCollection = getExtensionPointCollection(addin);

        return extensionPointCollectionSupportsSharedFolders(extensionPointCollection);
    });
}

function getExtensionPointCollection(addin: IAddin) {
    const addinCommands = [...addin.AddinCommands.values()];

    if (addinCommands.length == 0) {
        return null;
    }

    return addinCommands[0].extension.ExtensionPointCollection;
}
