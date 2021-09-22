import { lazySelectPersona } from 'owa-mail-folder-forest-actions';

export interface PersonaRouteParameters {
    favoriteNodeId: string;
}

export default async function personaRouteHandler(parameters: PersonaRouteParameters) {
    await lazySelectPersona.importAndExecute(parameters.favoriteNodeId);
}
