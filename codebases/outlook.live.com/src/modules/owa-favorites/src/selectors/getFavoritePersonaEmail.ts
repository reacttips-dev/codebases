import getFavoritePersona from './getFavoritePersona';

export default function getFavoritePersonaEmail(favoriteId: string): string | null {
    const persona = getFavoritePersona(favoriteId);
    return persona ? persona.mainEmailAddress : null;
}
