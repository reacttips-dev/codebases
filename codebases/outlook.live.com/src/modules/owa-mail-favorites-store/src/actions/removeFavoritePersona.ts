import type { ActionSource } from 'owa-mail-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import removeFavoritePersonaV1 from './v1/people/removeFavoritePersonaV1';
import { lazyRemoveFavoritePersonaV2 } from 'owa-favorites';

export default async function removeFavoritePersona(
    favoriteId: string,
    actionSource: ActionSource
): Promise<void> {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        const removeFavoritePersonaV2 = await lazyRemoveFavoritePersonaV2.import();
        removeFavoritePersonaV2(favoriteId, actionSource);
    } else {
        return removeFavoritePersonaV1(favoriteId, actionSource);
    }
}
