import { useState, useMemo, useCallback } from 'react';
import { getLocation } from '@trello/router';
import {
  getBoardShortLinkFromPathname,
  getCardShortLinkFromPathname,
  getRouteIdFromPathname,
  isBoardRoute,
  isCardRoute,
  isMemberHomeRoute,
} from '@trello/routes';
import { memberId } from '@trello/session-cookie';
import { isShortLink } from '@trello/shortlinks';
import {
  BoardRoutePreloaderDocument,
  BoardRoutePreloaderQuery,
} from './BoardRoutePreloaderQuery.generated';
import {
  BoardRoutePreloaderSecondaryDocument,
  BoardRoutePreloaderSecondaryQuery,
} from './BoardRoutePreloaderSecondaryQuery.generated';
import {
  CardRoutePreloaderDocument,
  CardRoutePreloaderQuery,
} from './CardRoutePreloaderQuery.generated';
import {
  MemberHomeRoutePreloaderDocument,
  MemberHomeRoutePreloaderQuery,
} from './MemberHomeRoutePreloaderQuery.generated';
import { client } from '@trello/graphql';

export enum PreloadStatus {
  PRELOADING = 'preloading',
  BOARD_PRELOAD_DISABLED = 'board_preload_disabled',
  INVALID_BOARD_SHORT_LINK = 'invalid_board_short_link',
  PRIMARY_BOARD_REQUEST_ERROR = 'primary_board_request_error',
  BOARD_NULL = 'board_null',
  ORGANIZATION_NULL = 'organization_null',
  SECONDARY_BOARD_REQUEST_ERROR = 'secondary_board_request_error',
  BOARD_SUCCESSFULLY_PRELOADED = 'board_successfully_preloaded',
  CARD_PRELOAD_DISABLED = 'card_preload_disabled',
  INVALID_CARD_SHORT_LINK = 'invalid_card_shortlink',
  CARD_REQUEST_ERROR = 'card_request_error',
  CARD_SUCCESSFULLY_LOADED = 'card_successfully_loaded',
  MEMBER_HOME_PRELOAD_DISABLED = 'member_home_preload_disabled',
  MEMBER_HOME_REQUEST_ERROR = 'member_home_request_error',
  MEMBER_HOME_SUCCESSFULLY_PRELOADED = 'member_home_successfully_preloaded',
  NO_PRELOADS_FOR_ROUTE = 'no_preloads_for_route',
}

/***
 * This hook should only ever perform one state transition from true to false. It should never transition back to true.
 * This allows us to preload data when the page first loads, but avoids problems caused by remounting TrelloOnline.
 * When TrelloOnline is remounted it will throw the exception "Backbone.history has already been started".
 */
export const useRoutePreloader = (
  {
    isBoardRoutePreloadingEnabled = false,
    isCardRoutePreloadingEnabled = false,
    isMemberHomeRoutePreloadingEnabled = false,
  }: {
    isBoardRoutePreloadingEnabled?: boolean;
    isCardRoutePreloadingEnabled?: boolean;
    isMemberHomeRoutePreloadingEnabled?: boolean;
  } = {
    isBoardRoutePreloadingEnabled: false,
    isCardRoutePreloadingEnabled: false,
    isMemberHomeRoutePreloadingEnabled: false,
  },
) => {
  const [preloadStatus, setPreloadStatus] = useState(PreloadStatus.PRELOADING);

  const endPreloading = useCallback(
    (status: PreloadStatus) => {
      if (preloadStatus === PreloadStatus.PRELOADING) {
        setPreloadStatus(status);
      }
    },
    [preloadStatus],
  );

  // We memoize the result here with a empty dependency array so that it is
  // only called once for the initial page load, and then not for transitions.
  const {
    boardShortLink,
    cardShortLink,
    isBoard,
    isCard,
    isMemberHome,
  } = useMemo(() => {
    const { pathname } = getLocation();
    const routeId = getRouteIdFromPathname(pathname);
    const isBoard = isBoardRoute(routeId);
    const isCard = isCardRoute(routeId);
    const isMemberHome = isMemberHomeRoute(routeId);

    return {
      isBoard,
      isCard,
      isMemberHome,
      boardShortLink: isBoard ? getBoardShortLinkFromPathname(pathname) : '',
      cardShortLink: isCard ? getCardShortLinkFromPathname(pathname) : '',
    };
  }, []);

  if (
    preloadStatus === PreloadStatus.PRELOADING &&
    memberId &&
    isBoard &&
    isBoardRoutePreloadingEnabled &&
    boardShortLink
  ) {
    if (!isShortLink(boardShortLink)) {
      endPreloading(PreloadStatus.INVALID_BOARD_SHORT_LINK);
    } else {
      client
        .query<BoardRoutePreloaderQuery>({
          query: BoardRoutePreloaderDocument,
          context: {
            operationName: 'BoardRoutePreloader',
          },
          variables: {
            boardId: boardShortLink || '',
            memberId: memberId || '',
          },
          fetchPolicy: 'network-only',
        })
        .then(({ data, loading: boardLoading, error: boardError }) => {
          if (boardError) {
            endPreloading(PreloadStatus.PRIMARY_BOARD_REQUEST_ERROR);
          }

          if (data?.board === null) {
            endPreloading(PreloadStatus.BOARD_NULL);
          }

          if (data?.board?.organization === null) {
            endPreloading(PreloadStatus.ORGANIZATION_NULL);
          }

          if (
            boardError === undefined &&
            boardLoading === false &&
            data?.board?.organization?.id
          ) {
            client
              .query<BoardRoutePreloaderSecondaryQuery>({
                query: BoardRoutePreloaderSecondaryDocument,
                context: {
                  operationName: 'BoardRouteSecondaryPreloader',
                },
                variables: {
                  orgId: data?.board?.organization?.id || '',
                },
                fetchPolicy: 'network-only',
              })
              .then(
                ({
                  loading: boardSecondaryLoading,
                  error: boardSecondaryError,
                }) => {
                  if (boardSecondaryError) {
                    endPreloading(PreloadStatus.SECONDARY_BOARD_REQUEST_ERROR);
                  }

                  if (
                    !boardSecondaryError &&
                    memberId &&
                    isBoard &&
                    isBoardRoutePreloadingEnabled &&
                    boardShortLink &&
                    isShortLink(boardShortLink) &&
                    boardLoading === false &&
                    boardSecondaryLoading === false &&
                    data?.board?.organization?.id
                  ) {
                    // We successfully finished preloading the primary and secondary board request.
                    endPreloading(PreloadStatus.BOARD_SUCCESSFULLY_PRELOADED);
                  }
                },
              );
          }
        });
    }
  }

  if (
    preloadStatus === PreloadStatus.PRELOADING &&
    memberId &&
    isCard &&
    isCardRoutePreloadingEnabled &&
    cardShortLink
  ) {
    if (!isShortLink(cardShortLink)) {
      endPreloading(PreloadStatus.INVALID_CARD_SHORT_LINK);
    } else {
      client
        .query<CardRoutePreloaderQuery>({
          query: CardRoutePreloaderDocument,
          context: {
            operationName: 'CardRoutePreloader',
          },
          variables: {
            cardId: cardShortLink || '',
            memberId: memberId || '',
          },
          fetchPolicy: 'network-only',
        })
        .then(({ loading: cardLoading, error: cardError }) => {
          if (cardError) {
            endPreloading(PreloadStatus.CARD_REQUEST_ERROR);
          }

          if (
            !cardError &&
            memberId &&
            isCard &&
            isCardRoutePreloadingEnabled &&
            cardShortLink &&
            isShortLink(cardShortLink) &&
            cardLoading === false
          ) {
            endPreloading(PreloadStatus.CARD_SUCCESSFULLY_LOADED);
          }
        });
    }
  }

  if (
    preloadStatus === PreloadStatus.PRELOADING &&
    memberId &&
    isMemberHome &&
    isMemberHomeRoutePreloadingEnabled
  ) {
    client
      .query<MemberHomeRoutePreloaderQuery>({
        query: MemberHomeRoutePreloaderDocument,
        context: {
          operationName: 'MemberHomeRoutePreloader',
        },
        variables: {
          memberId: memberId || '',
        },
        fetchPolicy: 'network-only',
      })
      .then(({ loading: memberHomeLoading, error: memberHomeError }) => {
        if (memberHomeError) {
          endPreloading(PreloadStatus.MEMBER_HOME_REQUEST_ERROR);
        }

        if (
          !memberHomeError &&
          memberId &&
          isMemberHome &&
          isMemberHomeRoutePreloadingEnabled &&
          memberHomeLoading === false
        ) {
          endPreloading(PreloadStatus.MEMBER_HOME_SUCCESSFULLY_PRELOADED);
        }
      });
  }

  if (isBoard && !isBoardRoutePreloadingEnabled) {
    endPreloading(PreloadStatus.BOARD_PRELOAD_DISABLED);
  }

  if (isCard && !isCardRoutePreloadingEnabled) {
    endPreloading(PreloadStatus.CARD_PRELOAD_DISABLED);
  }

  if (isMemberHome && !isMemberHomeRoutePreloadingEnabled) {
    endPreloading(PreloadStatus.MEMBER_HOME_PRELOAD_DISABLED);
  }

  // Don't preload for any other route.
  if (
    preloadStatus === PreloadStatus.PRELOADING &&
    !isBoard &&
    !isCard &&
    !isMemberHome
  ) {
    endPreloading(PreloadStatus.NO_PRELOADS_FOR_ROUTE);
  }

  return { preloadStatus };
};
