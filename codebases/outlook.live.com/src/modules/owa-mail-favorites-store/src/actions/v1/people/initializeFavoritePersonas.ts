import setupFavoritePersona from './setupFavoritePersona';
import datapoints from '../../../datapoints';
import {
    getFavoritePersonasRootFolderId,
    retrievePersonaSearchFolders,
} from 'owa-mail-persona-search-folder-services';
import type { MailFolder } from 'owa-graph-schema';
import { trace } from 'owa-trace';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import { mutatorAction } from 'satcheljs';
import { getStore } from '../../../store/store';

export default wrapFunctionForDatapoint(
    datapoints.InitializeFavoritePersonasAction,
    async function initializeFavoritePersonas(personaIds: string[]) {
        // This will create root favorite personas folder
        const parentFolderId = await getFavoritePersonasRootFolderId();
        setFavoritePersonasRootFolderId(parentFolderId);
        await retrievePersonaSearchFolders(personaIds, parentFolderId)
            .then(personaSearchFolders => {
                personaSearchFolders.forEach((personaSearchFolder: MailFolder) => {
                    setupFavoritePersona(personaSearchFolder);
                });
            })
            .catch(error => {
                const eventName = 'RetrievePersonaSearchFoldersFailed';
                trace.warn(eventName + ': ' + error);
                logUsage(eventName, [error.toString()]);
            });
    }
);

const setFavoritePersonasRootFolderId = mutatorAction(
    'setFavoritePersonasRootFolderId',
    (parentFolderId: string) => {
        getStore().favoritePersonasRootFolderId = parentFolderId;
    }
);
