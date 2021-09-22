import type { ActionSource } from 'owa-mail-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import addFavoritePersonaV1 from './v1/people/addFavoritePersonaV1';
import type { FavoritePersonaNode } from 'owa-favorites-types';
import { lazyAddFavoritePersonaV2 } from 'owa-favorites';

export default async function addFavoritePersona(
    personaId: string,
    emailAddress: string,
    displayName: string,
    actionSource: ActionSource
): Promise<FavoritePersonaNode | void> {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        const addFavoritePersonaV2 = await lazyAddFavoritePersonaV2.import();
        // Make sure to always send a defined displayName for the favorite
        const favoriteDisplayName = displayName || emailAddress;
        addFavoritePersonaV2(emailAddress, favoriteDisplayName, actionSource);
    } else {
        return addFavoritePersonaV1(personaId, emailAddress, displayName, actionSource);
    }
}
