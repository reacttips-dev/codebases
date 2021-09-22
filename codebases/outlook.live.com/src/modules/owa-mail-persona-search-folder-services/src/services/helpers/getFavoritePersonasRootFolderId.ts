import createFavoritePersonasRootFolder from '../createFavoritePersonasRootFolder';
import retrieveRootFavoritePersonasFolder from '../retrieveRootFavoritePersonasFolder';
import { logUsage } from 'owa-analytics';
import type FolderType from 'owa-service/lib/contract/Folder';
import { PROPERTY_TAG_HIDDEN } from '../createSearchFolderForPersona';

// Retrieves the folderId of 'FavoritePersonas', creates the folder if it doesn't exist
// In case the folder was created between retrieveFavoritePersonasFolder() and createFavoritePersonaFolder()
// we return the created folder
export default async function getFavoritePersonasRootFolderId(): Promise<string> {
    try {
        const favoritePersonaFolder = await retrieveRootFavoritePersonasFolder();
        if (favoritePersonaFolder) {
            logIsHiddenProperty(favoritePersonaFolder);
            return favoritePersonaFolder.FolderId.Id;
        }

        // disabling tslint rule as we need to await here
        // for the catch block to work properly
        // https://github.com/palantir/tslint/issues/3933
        // tslint:disable-next-line:no-return-await
        return await createFavoritePersonasRootFolder();
    } catch (reason) {
        // Folder exists should not impact user experience
        if (reason === 'ErrorFolderExists') {
            const favoritePersonaFolder = await retrieveRootFavoritePersonasFolder();
            logIsHiddenProperty(favoritePersonaFolder);
            return favoritePersonaFolder.FolderId.Id;
        }
        throw reason;
    }
}

function logIsHiddenProperty(favoritePersonaFolder: FolderType): void {
    if (!favoritePersonaFolder?.ExtendedProperty) {
        return;
    }

    const isHiddenProperty = favoritePersonaFolder.ExtendedProperty.filter(
        prop =>
            prop.ExtendedFieldURI?.PropertyTag &&
            prop.ExtendedFieldURI.PropertyTag.toLocaleLowerCase() === PROPERTY_TAG_HIDDEN
    );
    const isHidden =
        isHiddenProperty && isHiddenProperty.length === 1
            ? isHiddenProperty[0].Value
            : 'Property not found';

    logUsage('RootFavoritePersonaFolderLoaded', { isFolderHidden: isHidden });
}
