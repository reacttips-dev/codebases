import { orchestrator } from 'satcheljs';
import { removeFavoriteFailed } from 'owa-favorites';
import handleToggleFavoritePersonaError from './helpers/handleToggleFavoritePersonaError';
import handleToggleFavoritePdlError from './helpers/handleToggleFavoritePdlError';

export default orchestrator(removeFavoriteFailed, actionMessage => {
    const { favoriteKind, error } = actionMessage;
    if (error && error.statusCode === 404) {
        // Do not display a notification in case of a 404,
        // as the favorite will be removed from the UI
        return;
    }

    if (favoriteKind === 'persona') {
        handleToggleFavoritePersonaError(true /*isRemoveFailure*/);
    } else if (favoriteKind === 'privatedistributionlist') {
        handleToggleFavoritePdlError(true /*isRemoveFailure*/);
    }
});
