import { Analytics } from '@trello/atlassian-analytics';
import {
  JoinableSiteProductsCache,
  JoinableSiteProductsResponse,
  ProductKey,
  CachedBoardInfo,
  JoinableSiteProduct,
  JoinableSiteUser,
  LastVisitedBoard,
  JoinableSitesProductResponse,
  JoinableProductsResult,
  JoinableProductsWithProductUrl,
  JoinableSiteProductsRequest,
} from 'app/src/components/SwitcherSpotlight/types';
import { TrelloStorage } from '@trello/storage';
import { NOT_A_BOARD } from 'app/src/components/SwitcherSpotlight/useCurrentBoardId';
import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';
import { isCacheInvalidationEnabled } from 'app/src/components/SwitcherSpotlight/targeting';

const ONE_MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;
const CURRENT_CACHE_VERSION = 1;
const MANDO_PT_CACHE_KEY = 'mando-pt-cache';
export const getBlankCache = (): JoinableSiteProductsCache => ({
  boards: {},
  collaborators: {},
  sites: {},
  featureExposed: false,
  lastVisitedBoard: {
    collaboratorStamp: null,
    id: null,
  },
  version: CURRENT_CACHE_VERSION,
});

const isObject = (v: unknown) => v && typeof v === 'object';

export const getCacheKey = (userId: string) =>
  `${MANDO_PT_CACHE_KEY}-${userId}`;

export const getMandoPtCache = (userId: string) => {
  try {
    const cache: JoinableSiteProductsCache = TrelloStorage.get(
      getCacheKey(userId),
    );

    if (!cache) {
      throw new Error('No PT cache present');
    }

    const { boards, collaborators, sites, version } = cache;

    if (version !== CURRENT_CACHE_VERSION) {
      throw new Error('PT Cache Version Mismatch');
    }

    const allValuesMatch = [boards, collaborators, sites].every(isObject);

    if (!allValuesMatch) {
      throw new Error('PT Cache Values Mismatch');
    }

    return cache;
  } catch (err) {
    if (err?.message !== 'No PT cache present') {
      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'mandoPtCache',
        source: 'boardScreen',
        attributes: {
          message: err?.message,
          name: err?.name,
        },
      });
    }

    return getBlankCache();
  }
};

export const setMandoPtCache = (
  userId: string,
  cache: JoinableSiteProductsCache,
) => {
  TrelloStorage.set(getCacheKey(userId), cache);
};

export const hashCollaborators = (collaborators: JoinableSiteUser[]) => {
  return JSON.stringify(collaborators.map(({ accountId }) => accountId));
};

/**
 * Determine which cached board ID to surface
 * See the comments inside for more info
 */
export const resolveBoard = (
  currentBoardId: string,
  cachedBoards: JoinableSiteProductsCache['boards'],
  lastVisitedBoard: LastVisitedBoard,
): CachedBoardInfo | null => {
  let resolvedBoardId: string | null = currentBoardId;
  let resolvedBoard: CachedBoardInfo | null = null;

  if (
    currentBoardId === NOT_A_BOARD &&
    lastVisitedBoard?.id &&
    lastVisitedBoard?.collaboratorStamp
  ) {
    resolvedBoardId = lastVisitedBoard?.id;
  }

  resolvedBoard = cachedBoards[resolvedBoardId] ?? null;

  if (!resolvedBoard) {
    resolvedBoardId = null;
  }

  return resolvedBoard;
};

export const sortByRelevanceAndProduct = (
  { relevance: aRel = 0, products: aProducts, url: urlA }: JoinableSiteProduct,
  { relevance: bRel = 0, products: bProducts, url: urlB }: JoinableSiteProduct,
): number => {
  // Product with higher relevance comes first
  const diff = bRel - aRel;
  if (diff !== 0) return diff;

  // If relevance is the same, Confluence comes before Jira
  const [productAKey] = Object.keys(aProducts);
  if (productAKey === ProductKey.CONFLUENCE) return -1;

  const [productBKey] = Object.keys(bProducts);
  if (productBKey === ProductKey.CONFLUENCE) return 1;

  // Add tertiary alphabetic sort by site URL
  if (urlA < urlB) return -1;
  if (urlA > urlB) return 1;

  // Else order stays the same
  return 0;
};

export const transformNewJoinableSitesRequest = (
  products: string[],
  collaborators: string[],
  experience = 'atlassianSwitcher',
  accessType = ['DES', 'RA'],
): JoinableSiteProductsRequest => {
  const result: JoinableSiteProductsRequest = {
    products: { productKeys: [], accessType },
    collaborators: { userIds: [] },
    context: { product: 'trello', experience },
  };
  result['collaborators']['userIds'] = [...collaborators];
  result['products']['productKeys'] = products?.map(
    (product: string) => product?.split('.')[0],
  );
  return result;
};

export const transformNewJoinableSitesResponse = (
  data: JoinableSitesProductResponse,
): JoinableSiteProductsResponse => {
  const result: JoinableSiteProductsResponse = { sites: [] };
  const joinableProducts: JoinableProductsResult[] =
    data?.['joinableProducts'] || [];
  if (!Array.isArray(joinableProducts)) return result;
  result.sites = joinableProducts.map(
    ({
      cloudId = '',
      ari: resourceId = '',
      displayName = '',
      siteUrl: url,
      avatarUrl = '',
      relevance = 0,
      collaborators = [],
      productUrl = '',
      productKey = '',
    }) => {
      const products: JoinableProductsWithProductUrl = {
        [productKey]: {
          collaborators: [],
          productUrl,
        },
      };

      products[productKey]['collaborators'] = collaborators.map(
        ({ userId: accountId = '', displayName = '', avatarUrl = '' }) => {
          return {
            id: '',
            accountId,
            displayName,
            avatarUrl,
          };
        },
      );

      return {
        cloudId,
        resourceId,
        displayName,
        url,
        avatarUrl,
        relevance,
        products,
        // new response doesnt contain these properties yet, but may be used in switcher component
        userAccessLevel: '',
        roleAri: '',
        isInternalProductRecommendation: false,
      };
    },
  );
  return result;
};

export const sortSitesByRelevanceAndProduct = ({
  sites,
}: JoinableSiteProductsResponse): JoinableSiteProductsResponse => ({
  sites: sites.sort(sortByRelevanceAndProduct),
});

export const reconstructCollaborators = (
  collaboratorStamp: string,
  cachedCollaboratorDetails: JoinableSiteProductsCache['collaborators'],
) => {
  const collaboratorIds: string[] = JSON.parse(collaboratorStamp);
  return collaboratorIds
    .map((aaId) => cachedCollaboratorDetails[aaId])
    .filter((collaborator) => !!collaborator);
};

export const isCachedBoardInvalidated = (
  cachedBoard: CachedBoardInfo,
  isCacheAgeCheckEnabled: boolean,
): boolean => {
  const isCacheExpresslyInvalidated: boolean = cachedBoard.invalidated ?? false;
  let isCacheExpired: boolean = false;

  if (isCacheAgeCheckEnabled) {
    const cacheAge = Date.now() - (cachedBoard.lastCached ?? 0);
    isCacheExpired = cacheAge >= ONE_MONTH_IN_MS;
  }

  return isCacheExpresslyInvalidated || isCacheExpired;
};
/** Retrieve cached response and reset lastAccessed */
export const retrieveCachedResponse = (
  currentBoardId: string,
  userId: string,
): JoinableSiteProductsResponse | null => {
  try {
    const cache = getMandoPtCache(userId);

    const {
      boards: cachedBoards,
      collaborators: cachedCollaboratorDetails,
      sites: cachedSites,
      lastVisitedBoard,
    } = cache;

    const resolvedBoard = resolveBoard(
      currentBoardId,
      cachedBoards,
      lastVisitedBoard,
    );

    if (
      !resolvedBoard ||
      isCachedBoardInvalidated(resolvedBoard, isCacheInvalidationEnabled())
    ) {
      return null;
    }

    const resolvedCollaborators = reconstructCollaborators(
      resolvedBoard.collaboratorStamp,
      cachedCollaboratorDetails,
    );

    const cachedResponse = {
      sites: resolvedBoard.joinableProducts
        .map<JoinableSiteProduct>(({ productUrl, relevance }) => {
          const cachedSite = { ...cachedSites[productUrl], relevance };
          const { products, ...otherSiteDetails } = cachedSite;
          const [[productKey, product]] = Object.entries(products);

          return {
            ...otherSiteDetails,
            products: {
              [productKey]: {
                ...product,
                collaborators: resolvedCollaborators.filter(
                  ({ accountId }) => !!product.collaborators[accountId],
                ),
              },
            },
          };
        })
        .sort(sortByRelevanceAndProduct),
    };

    return cachedResponse;
  } catch (err) {
    sendErrorEvent(err, {
      tags: {
        ownershipArea: 'trello-workflowers',
        feature: Feature.PushTouchpointsSwitcherSpotlight,
      },
      extraData: {
        subjectMethod: 'retrieveCachedResponse',
        boardId: currentBoardId,
      },
    });

    return null;
  }
};
