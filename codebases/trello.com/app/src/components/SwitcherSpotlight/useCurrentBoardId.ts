import { useEffect, useState } from 'react';
import { useLocation } from '@trello/router';
import { RouteId, routes, useRouteId } from '@trello/routes';

export const NOT_A_BOARD = 'not-a-board';
const BOARD_ROUTES = [RouteId.BOARD, RouteId.BOARD_REFERRAL];

/** Know if we're on a board */
export const isBoard = (routeId: string) =>
  BOARD_ROUTES.some((boardRoute) => boardRoute === routeId);

/** Get the ID of the current board */
export const useCurrentBoardId = (skip?: boolean): string => {
  const [boardId, setBoardId] = useState<string>(NOT_A_BOARD);
  const routeId = useRouteId();
  const { pathname } = useLocation();

  useEffect(() => {
    if (skip || !routeId || !pathname || !isBoard(routeId)) {
      setBoardId(NOT_A_BOARD);
      return;
    }

    const match = routes[routeId].regExp.exec(pathname.slice(1));
    const newBoardId = match?.[1];
    setBoardId(newBoardId ?? NOT_A_BOARD);
  }, [routeId, pathname, skip]);

  return boardId;
};
