import getFavoritePersona from './getFavoritePersona';

export default function getFavoritePersonaDisplayName(favoriteId: string): string | null {
    const persona = getFavoritePersona(favoriteId);
    return persona ? persona.displayName : null;
}
