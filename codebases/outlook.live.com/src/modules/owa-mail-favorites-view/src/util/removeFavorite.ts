import {
    lazyRemoveFavoriteCategory,
    lazyRemoveFavoritePrivateDistributionList,
} from 'owa-favorites';
import {
    lazyRemoveFavoritePersona,
    lazyHandleToggleFavoritePersonaError,
} from 'owa-mail-favorites-store';

export const removeFavoriteCategory = async (categoryId: string) => {
    const removeFavoriteCategory = await lazyRemoveFavoriteCategory.import();
    removeFavoriteCategory(categoryId, 'ContextCategory');
};

export const removeFavoritePersona = (favoriteId: string) => {
    lazyRemoveFavoritePersona
        .importAndExecute(favoriteId, 'ContextPersona')
        .catch(() => lazyHandleToggleFavoritePersonaError.importAndExecute(true));
};

export async function removeFavoritePDL(favoriteId: string) {
    const removeFavoritePrivateDistributionList = await lazyRemoveFavoritePrivateDistributionList.import();
    removeFavoritePrivateDistributionList(favoriteId, 'ContextPrivateDistributionList');
}
