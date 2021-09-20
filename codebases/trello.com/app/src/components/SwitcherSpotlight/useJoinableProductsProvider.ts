import { useMemo } from 'react';
import { createProviderWithCustomFetchData } from '@atlaskit/atlassian-switcher';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { atlassianApiGateway, clientVersion } from '@trello/config';
import {
  JoinableSiteProductsResponse,
  JoinableSitesDataProvider,
  JoinableSiteUser,
  ProductKey,
} from './types';
import { useCurrentBoardId } from './useCurrentBoardId';
import { useBoardMemberInfo } from './useBoardMemberInfo';
import {
  cacheResponse,
  retrieveCachedResponse,
  isReadyToRetryApiCall,
  setLastApiError,
  sortSitesByRelevanceAndProduct,
  replaceNonBoardWithLastVisited,
  transformNewJoinableSitesResponse,
  transformNewJoinableSitesRequest,
  enrichSiteWithCollaboratorInfo,
} from './caching';
import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';
import { isExcludedNoisyError } from './isExcludedNoisyError';
import { isBrowserSupported, asString } from '@trello/browser';

const getBlankResponse = (): JoinableSiteProductsResponse => ({ sites: [] });
const NEW_XFLOW_ENDPOINT_URL = `${atlassianApiGateway}gateway/api/xflow/cloud/joinable-products?model=collaborators`;
const PRODUCTS = [ProductKey.JIRA_SOFTWARE, ProductKey.CONFLUENCE];

/** Try to return result from cache first, only then call API */
export const fetchJoinableProducts = async (
  boardId: string,
  userId: string,
  products: ProductKey[],
  aaIdBoardMembers: JoinableSiteUser[] = [],
): Promise<JoinableSiteProductsResponse> => {
  try {
    const cached = retrieveCachedResponse(boardId, userId);

    if (cached) {
      return cached;
    }

    if (!isReadyToRetryApiCall()) {
      return getBlankResponse();
    }

    const {
      resolvedBoardId,
      resolvedCollaborators,
    } = replaceNonBoardWithLastVisited(boardId, userId, aaIdBoardMembers);

    const collaborators = resolvedCollaborators.map(
      ({ accountId }) => accountId,
    );

    const payload = transformNewJoinableSitesRequest(products, collaborators);
    const response = await fetch(NEW_XFLOW_ENDPOINT_URL, {
      method: 'post',
      body: JSON.stringify(payload),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
      },
    });

    if (!response.ok) {
      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'fetchRecommendedProducts',
        source: 'boardScreen',
        containers: formatContainers({ idBoard: resolvedBoardId }),
        attributes: {
          message: response.statusText,
          status: response.status,
          collaborators: JSON.stringify(collaborators),
          isBrowserSupported: isBrowserSupported(),
          browser: asString,
        },
      });

      setLastApiError();
      return getBlankResponse();
    }

    Analytics.sendOperationalEvent({
      action: 'succeeded',
      actionSubject: 'fetchRecommendedProducts',
      source: 'boardScreen',
      containers: formatContainers({ idBoard: resolvedBoardId }),
      attributes: {
        collaborators: JSON.stringify(collaborators),
        isBrowserSupported: isBrowserSupported(),
        browser: asString,
      },
    });

    const jsonResponse = sortSitesByRelevanceAndProduct(
      transformNewJoinableSitesResponse(await response.json()),
    );

    jsonResponse.sites = jsonResponse.sites.map(
      enrichSiteWithCollaboratorInfo(resolvedCollaborators),
    );

    cacheResponse(resolvedBoardId, userId, resolvedCollaborators, jsonResponse);
    return jsonResponse;
  } catch (err) {
    if (!isExcludedNoisyError(err?.message)) {
      sendErrorEvent(err, {
        tags: {
          ownershipArea: 'trello-workflowers',
          feature: Feature.PushTouchpointsSwitcherSpotlight,
        },
        extraData: {
          subjectMethod: 'fetchJoinableProducts',
          boardId,
        },
      });
    }

    setLastApiError();
  }

  return getBlankResponse();
};

/** Rebuilds the provider whenever we switch boards or go to a non-board screen */
export const useJoinableProductsProvider = (userId: string, skip: boolean) => {
  const boardId = useCurrentBoardId(skip);
  const { data: collaborators, loading, error } = useBoardMemberInfo(
    boardId,
    userId,
    skip,
  );

  const doSkip = skip || loading || !!error;
  const provider = useMemo(() => {
    if (!doSkip) {
      return createProviderWithCustomFetchData<JoinableSiteProductsResponse>(
        'joinableSites',
        () => fetchJoinableProducts(boardId, userId, PRODUCTS, collaborators),
      ) as JoinableSitesDataProvider;
    }
  }, [doSkip, boardId, collaborators, userId]);

  return provider;
};
