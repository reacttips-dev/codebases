import { getPersonaFromPersonIdOrEmailAddress } from 'owa-favorites';
import type { FavoritePersonaData, FavoritePersonaNode } from 'owa-favorites-types';

export default function getFavoriteIdForPersona(
    personaId: string,
    personaEmailAddress: string
): string {
    const favoritePersona = getPersonaFromPersonIdOrEmailAddress(personaId, personaEmailAddress);

    const favoritePersonaData = favoritePersona as FavoritePersonaData;
    if (favoritePersonaData?.favoriteId) {
        return favoritePersonaData.favoriteId;
    }

    const favoritePersonaNode = favoritePersona as FavoritePersonaNode;
    if (favoritePersonaNode?.id) {
        return favoritePersonaNode.id;
    }

    return undefined;
}
