import {
  JoinableSiteProductsCache,
  JoinableSiteProductsResponse,
  JoinableSiteUser,
  CachedBoardInfo,
} from 'app/src/components/SwitcherSpotlight/types';
import {
  getMandoPtCache,
  setMandoPtCache,
  hashCollaborators,
} from './retrieveCachedResponse';
import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';

export const initializeBoardCache = (
  collaborators: JoinableSiteUser[],
): CachedBoardInfo => ({
  joinableProducts: [],
  collaboratorStamp: hashCollaborators(collaborators),
});

/**
 * Cache response and set lastAccessed for first time
 */
export const cacheResponse = (
  boardId: string,
  userId: string,
  updatedBoardMembers: JoinableSiteUser[],
  jsonResponse: JoinableSiteProductsResponse,
) => {
  try {
    const cache = getMandoPtCache(userId);
    cache.boards[boardId] = initializeBoardCache(updatedBoardMembers);

    jsonResponse.sites.forEach(({ products, ...otherSiteDetails }) => {
      // There is only one joinable product per site
      const [[joinableProductKey, joinableProduct]] = Object.entries(products);
      const { productUrl } = joinableProduct;
      const { relevance = 0 } = otherSiteDetails;

      // Store the product url and relevance associated with this board
      cache.boards[boardId].joinableProducts = [
        ...cache.boards[boardId].joinableProducts,
        { productUrl, relevance },
      ];

      // Store collaborator details separately from sites and boards.
      // This avoids storing duplicated data and keeps cache size smaller.
      // When retrieving from cache relevant product collaborators are the
      // Intersection between the collaborator aaIds stored on the site-product
      // And the aaIds of the board collaborators.
      // This also helps us retrieve collaborators for last visited board
      // When the user opens switcher menu on a non-board route.
      cache.collaborators = {
        ...cache.collaborators,
        ...joinableProduct.collaborators.reduce<
          JoinableSiteProductsCache['collaborators']
        >((result, collab) => {
          result[collab.accountId] = collab;
          return result;
        }, {}),
      };

      const cachedSiteProductCollaborators =
        cache.sites[joinableProduct.productUrl]?.products[joinableProductKey]
          ?.collaborators || {};

      const extendedSiteProductCollaborators = joinableProduct.collaborators.reduce(
        (collaboratorIndex, { accountId }) => {
          collaboratorIndex[accountId] = accountId;
          return collaboratorIndex;
        },
        cachedSiteProductCollaborators,
      );

      // Store site-product data separately to avoid duplication
      // Each board knows which product urls are associated with it
      // Also strip collaborators down to their ids, as the collaborator
      // Data is stored separately. See preceding comment.
      cache.sites = {
        ...cache.sites,
        [joinableProduct.productUrl]: {
          ...otherSiteDetails,
          products: {
            [joinableProductKey]: {
              ...joinableProduct,
              collaborators: extendedSiteProductCollaborators,
            },
          },
        },
      };
    }); // END of jsonResponse.sites.forEach

    cache.boards[boardId].lastCached = Date.now();
    setMandoPtCache(userId, cache);
  } catch (err) {
    sendErrorEvent(err, {
      tags: {
        ownershipArea: 'trello-workflowers',
        feature: Feature.PushTouchpointsSwitcherSpotlight,
      },
      extraData: {
        subjectMethod: 'cacheResponse',
        boardId,
      },
    });
  }
};
