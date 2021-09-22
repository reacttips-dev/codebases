import { orchestrator } from 'satcheljs';
import { addFavoriteFailed } from 'owa-favorites';
import handleToggleFavoritePersonaError from './helpers/handleToggleFavoritePersonaError';
import handleToggleFavoritePdlError from './helpers/handleToggleFavoritePdlError';

export default orchestrator(addFavoriteFailed, actionMessage => {
    const { favoriteKind } = actionMessage;
    if (favoriteKind === 'persona') {
        handleToggleFavoritePersonaError(false /*isRemoveFailure*/);
    } else if (favoriteKind === 'privatedistributionlist') {
        handleToggleFavoritePdlError(false /*isRemoveFailure*/);
    }
});
