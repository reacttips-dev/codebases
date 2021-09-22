import { lazySelectPrivateDistributionList } from 'owa-mail-folder-forest-actions';

export interface PdlRouteParameters {
    favoriteNodeId: string;
}

export default async function personaRouteHandler(parameters: PdlRouteParameters) {
    await lazySelectPrivateDistributionList.importAndExecute(parameters.favoriteNodeId);
}
