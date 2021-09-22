import { mutator } from 'satcheljs';
import outlookFavoritePersonaSearchFoldersLoaded from '../actions/outlookFavoritePersonaSearchFoldersLoaded';
import getFolderTable from '../selectors/getFolderTable';
import { mapOWSFolderToGql } from 'owa-folder-gql-mappers';
import { getUserMailboxInfo } from 'owa-client-ids';

/**
 * load the existing folders in the folderStore, if there's a favoritePersona or favorite PDL with that searchFolderId
 */
export default mutator(outlookFavoritePersonaSearchFoldersLoaded, actionMessage => {
    const folders = actionMessage.existingFolders;

    folders.forEach(folder => {
        if (folder) {
            const folderId = folder.FolderId.Id;

            const personaOrPdlForFolderId = actionMessage.personaOrPdlFavorites.filter(
                persona => persona.searchFolderId === folderId
            );

            if (personaOrPdlForFolderId.length === 1) {
                // The persona search folder includes a guid in the displayName which surfaces
                // in certain dialogs, for example "Delete All". By changing the display name here,
                // the folder doesn't need any special treatment.

                const personaOrPdl = personaOrPdlForFolderId[0];
                const displayName = personaOrPdl.displayName;
                const searchFolder = {
                    ...mapOWSFolderToGql(folder, getUserMailboxInfo()),
                    DisplayName: displayName,
                };
                getFolderTable().set(folder.FolderId.Id, searchFolder);
            }
        }
    });
});
