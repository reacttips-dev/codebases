import { getPersonaNodeIdFromExtendedProperty } from './getValueFromExtendedProperty';
import type { SearchFolderPersona } from '../schemas/SearchFolderPersona';
import createSearchFolderForPersona from '../services/createSearchFolderForPersona';
import deleteFolders from '../services/deleteFolders';
import retrievePersonaSearchFolders from '../services/retrievePersonaSearchFolders';
import type FolderType from 'owa-service/lib/contract/Folder';
import * as trace from 'owa-trace';
import { logUsage } from 'owa-analytics';
import { isGuid } from 'owa-guid';

const synchronizePersonaSearchFolderEventName = 'SynchronizePersonaSearchFolder';

export type SynchronizePersonaSearchFolderSource = 'OnAdd' | 'OnClick' | 'OnFavoriteUpdate';

// The caller of this function should not need to know if the folder existed or if it was created
export default async function synchronizePersonaSearchFolder(
    persona: SearchFolderPersona,
    parentFolderId: string,
    source: SynchronizePersonaSearchFolderSource,
    hasPersonaInformationChanged: boolean
): Promise<FolderType> {
    // Retrieve the existing search folders (only those matching persona id)
    const existingSearchFolders: FolderType[] = await retrievePersonaSearchFolders(
        [persona.favoriteNodeId],
        parentFolderId
    );

    return findOrCreateSearchFolderForFavoritePersona(
        persona,
        existingSearchFolders,
        parentFolderId,
        source,
        hasPersonaInformationChanged
    );
}

export async function findOrCreateSearchFolderForFavoritePersona(
    persona: SearchFolderPersona,
    existingSearchFolders: FolderType[],
    parentFolderId: string,
    source: SynchronizePersonaSearchFolderSource,
    personaInformationChanged?: boolean
): Promise<FolderType> {
    // There are 3 cases we need to consider:
    // 1) The search folder does not exist, then the promise contains the newly created folder
    // 2) The search folder needs to be updated as it does exist but personaInformationChanged is true, the promise contains the new folder
    // 3) The search folder is up to date, then the promise contains the existing folder

    const existingSearchFolder = filterSearchFolderForPerson(
        persona.favoriteNodeId,
        existingSearchFolders
    );
    const idToLog = isGuid(persona.favoriteNodeId) ? persona.favoriteNodeId : '';

    try {
        if (!existingSearchFolder) {
            // Search folder does not exist
            logUsage(synchronizePersonaSearchFolderEventName, [
                'SearchFolderDoesNotExist',
                source,
                idToLog,
            ]);
            const newFolder = await createSearchFolderForPersona(parentFolderId, persona);
            return newFolder;
        } else if (personaInformationChanged) {
            // Search folder exists, but the persona information has changed
            logUsage(synchronizePersonaSearchFolderEventName, [
                'SearchFolderNeedsUpdate',
                source,
                idToLog,
            ]);
            await deleteFolders([existingSearchFolder.FolderId.Id], true);
            const updatedFolder = await createSearchFolderForPersona(parentFolderId, persona);
            return updatedFolder;
        } else {
            // Search folder is up to date, filters and version changed are currently ignored
            logUsage(synchronizePersonaSearchFolderEventName, [
                'SearchFolderExists',
                source,
                idToLog,
            ]);
            return existingSearchFolder;
        }
    } catch (error) {
        throw new Error(
            'Error when creating/deleting search folder for persona: ' +
                error +
                '. Source: ' +
                source
        );
    }
}

function filterSearchFolderForPerson(
    favoriteNodeId: string,
    existingSearchFolders: FolderType[]
): FolderType | undefined {
    const filteredSearchFolders: FolderType[] = existingSearchFolders.filter(
        folder => getPersonaNodeIdFromExtendedProperty(folder) === favoriteNodeId
    );

    if (filteredSearchFolders.length > 1) {
        trace.errorThatWillCauseAlert(
            filteredSearchFolders.length + ' items were returned, one was expected'
        );
    }

    return filteredSearchFolders.length === 1 && filteredSearchFolders[0];
}
