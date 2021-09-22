import { getStore } from '../store/store';
import { isFeatureEnabled } from 'owa-feature-flags';
import type {
    FavoritePersonaData,
    FavoritePersonaNode,
    FavoriteSearchData,
    FavoritePrivateDistributionListData,
} from 'owa-favorites-types';
import type { PrivateDistributionListMember } from 'owa-persona-models';
import { haveSameMembers } from '../utils/pdlUtils';
import getFavoriteIdFromGroupId from '../actions/v2/helpers/getFavoriteIdFromGroupId';
import getFavoriteIdFromCategoryId from '../selectors/v2/getFavoriteIdFromCategoryId';
import getFavoriteIdFromFolderId from '../selectors/v2/getFavoriteIdFromFolderId';

/**
 * Checks if there is a favorite node in favorite store that has the same id
 * @param folderId the specified folder id
 * @return true if the favorite store has the folder with the same id, false otherwise
 */
export function isFolderInFavorites(folderId: string): boolean {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        return !!getFavoriteIdFromFolderId(folderId);
    } else {
        // Directly retrieve the favorite data from store,
        // as the favorite id is the folder id with Beta Favorites implementation
        return getStore().favoritesFolderNodes.has(folderId);
    }
}

/**
 * Checks if there is a favorite node in favorite store that has the same id
 * @param groupId the specified group id
 * @return true if the favorite store has the group with the same id, false otherwise
 */
export function isGroupInFavorites(groupId: string): boolean {
    return !!getFavoriteIdFromGroupId(groupId);
}

/**
 * Checks if there is a favorite search in favorite store that has the same query
 * @param query the search query string
 * @return true if the favorite store has the search with the same query, false otherwise
 */
export function isSearchInFavorites(query: string): boolean {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        return [...getStore().outlookFavorites.values()]
            .filter(favorite => favorite.type === 'search')
            .some(favorite => (favorite as FavoriteSearchData).searchQuery === query);
    } else {
        return getStore().favoriteSearches.has(query);
    }
}

/**
 * Checks if there is a favorite category in favorite store that has the same id
 * @param categoryId the guid of the category which is sent down from the server
 * @return true if the favorite store has the category  with the same categoryId, false otherwise
 */
export function isCategoryInFavorites(categoryId: string): boolean {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        return !!getFavoriteIdFromCategoryId(categoryId);
    } else {
        return getStore().favoriteCategories.has(categoryId);
    }
}

/**
 * Checks whether any node in the store has the given personaId as field, or the given email address
 *
 * LivePersonaCard scenario - we might have personaId but it's not mandatory
 * Search scenario - we have only email
 * Favorite person column scenario - we have personaId
 * People Hub scenario, we might have only personaId and no email
 */
export function isPersonaInFavorites(personaId: string, personaEmailAddress: string): boolean {
    return getPersonaFromPersonIdOrEmailAddress(personaId, personaEmailAddress) !== null;
}

export function isPrivateDLInFavorites(
    pdlId: string,
    pdlMembers: PrivateDistributionListMember[]
): boolean {
    return [...getStore().outlookFavorites.values()]
        .filter(favorite => favorite.type === 'privatedistributionlist')
        .some(
            favoriteData =>
                (favoriteData as FavoritePrivateDistributionListData).pdlId === pdlId ||
                haveSameMembers(
                    (favoriteData as FavoritePrivateDistributionListData).members,
                    pdlMembers
                )
        );
}

/**
 * Checks if there is a favorite node in favorite store that has the same id
 * @param folderId the specified public folder id
 * @return true if the favorite store has the public folder with the same id, false otherwise
 */
export function isPublicFolderInFavorites(folderId: string): boolean {
    return getStore().favoriteSecondaryKeyMap.has(folderId);
}

export function getPersonaFromPersonIdOrEmailAddress(
    personaId: string,
    personaEmailAddress: string
): FavoritePersonaData | FavoritePersonaNode {
    const state = getStore();

    let filteredPersona = null;
    if (isFeatureEnabled('tri-favorites-roaming')) {
        const allFavorites = [...state.outlookFavorites.values()];
        filteredPersona = allFavorites.filter(
            favorite =>
                favorite.type === 'persona' &&
                personaDetailsFoundInNodeInfo(
                    favorite as FavoritePersonaData,
                    personaId,
                    personaEmailAddress
                )
        ) as FavoritePersonaData[];
    } else {
        filteredPersona = [...state.favoritesPersonaNodes.values()].filter(node =>
            personaDetailsFoundInNodeInfo(node, personaId, personaEmailAddress)
        ) as FavoritePersonaNode[];
    }

    if (filteredPersona && filteredPersona.length > 0) {
        return filteredPersona[0];
    }

    return null;
}

function personaDetailsFoundInNodeInfo(
    node: FavoritePersonaNode | FavoritePersonaData,
    personaId: string,
    personaEmailAddress: string
): boolean {
    return (
        (personaId && node.personaId === personaId) ||
        (personaEmailAddress &&
            node.allEmailAddresses &&
            node.allEmailAddresses.some(
                emailAddress =>
                    emailAddress &&
                    emailAddress.toLocaleLowerCase() === personaEmailAddress.toLocaleLowerCase()
            ))
    );
}
