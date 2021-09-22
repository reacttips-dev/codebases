import extensionPointCollectionSupportsSharedFolders from './extensionPointCollectionSupportsSharedFolders';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';

export function filterSupportsSharedFolderAddinCommands<T extends IAddinCommand>(
    addinCommand: T[]
): T[] {
    return addinCommand.filter(addinCommand => {
        const extensionPointCollection = addinCommand.extension.ExtensionPointCollection;
        return extensionPointCollectionSupportsSharedFolders(extensionPointCollection);
    });
}

export function addinCommandSupportsSharedFolders(addinCommand: IAddinCommand): boolean {
    const extensionPointCollection = addinCommand.extension.ExtensionPointCollection;

    return extensionPointCollectionSupportsSharedFolders(extensionPointCollection);
}
