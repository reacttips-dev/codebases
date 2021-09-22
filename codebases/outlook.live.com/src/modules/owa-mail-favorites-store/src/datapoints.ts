import type { ActionSource } from 'owa-mail-store';
import { isGuid } from 'owa-guid';
import type PersonaType from 'owa-service/lib/contract/PersonaType';

export default {
    RemoveFavoritePersonaAction: {
        name: 'RemoveFavoritePersonaAction',
        customData: (personaId: string, actionSource: ActionSource) => [actionSource],
    },

    AddFavoritePersonaAction: {
        name: 'AddFavoritePersonaAction',
        customData: (
            personaId: string | null,
            emailAddress: string | null,
            displayName: string,
            actionSource: ActionSource,
            valueForResolution: string,
            contactResolver: () => Promise<PersonaType | null>
        ) => [actionSource],
    },

    ValidateAndUpdateFavorite: {
        name: 'ValidateAndUpdateFavorite',
        customData: (currentNodeId: string) => (isGuid(currentNodeId) ? [currentNodeId] : null),
    },

    DeleteFolderFailure: {
        name: 'DeleteFolderFailure',
        customData: (error: string) => [error],
    },

    OnFavoritePersonaSelectedAction: {
        name: 'OnFavoritePersonaSelectedAction',
    },

    InitializeFavoritePersonasAction: {
        name: 'InitializeFavoritePersonasAction',
    },

    OneOffAddressUsedForFavorite: 'OneOffAddressUsedForFavorite',
    OutlookFavoritePersonasLoaded: {
        name: 'OutlookFavoritePersonasLoaded',
    },
};
