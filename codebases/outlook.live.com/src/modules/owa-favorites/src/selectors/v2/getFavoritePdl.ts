import store from '../../store/store';
import { haveSameMembers } from '../../utils/pdlUtils';
import type { FavoritePrivateDistributionListData } from 'owa-favorites-types';
import type { PrivateDistributionListMember } from 'owa-persona-models';

export default function getFavoriteIdForPDL(
    pdlId: string,
    pdlMembers: PrivateDistributionListMember[]
): string {
    return getFavoriteIdForPDLId(pdlId) || getFavoriteIdForPDLMembers(pdlMembers);
}

function getFavoriteIdForPDLId(pdlId: string): string {
    const matchingFavorites = [...store.outlookFavorites.values()].filter(
        favorite =>
            favorite.type === 'privatedistributionlist' &&
            (favorite as FavoritePrivateDistributionListData).pdlId === pdlId
    );

    return matchingFavorites.length > 0 ? matchingFavorites[0].favoriteId : undefined;
}

function getFavoriteIdForPDLMembers(pdlMembers: PrivateDistributionListMember[]): string {
    const matchingFavorites = [...store.outlookFavorites.values()].filter(
        favorite =>
            favorite.type === 'privatedistributionlist' &&
            haveSameMembers((favorite as FavoritePrivateDistributionListData).members, pdlMembers)
    );

    return matchingFavorites.length > 0 ? matchingFavorites[0].favoriteId : undefined;
}
