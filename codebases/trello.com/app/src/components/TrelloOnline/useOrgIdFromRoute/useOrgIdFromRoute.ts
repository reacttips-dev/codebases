import { useOrgIdFromModel } from './useOrgIdFromModel';
import { useOrgIdFromBoard } from './useOrgIdFromBoard';
import { useOrgIdFromCard } from './useOrgIdFromCard';
import { getRouteIdFromPathname, RouteId } from '@trello/routes';
import { useState, useEffect } from 'react';

//path starts with /:name/...
const memberOrOrgRoutes = [
  // Possible org routes
  RouteId.ACCOUNT,
  RouteId.BILLING,
  RouteId.BILLING_CARD,
  RouteId.BILLING_CARD_PRODUCT,
  RouteId.MEMBER_HOME,
  RouteId.MEMBER_HOME_BOARDS,
  RouteId.PROFILE,
  RouteId.USER_OR_ORG,
  // Definite org routes
  RouteId.ORGANIZATION_EXPORT,
  RouteId.ORGANIZATION_FREE_TRIAL,
  RouteId.ORGANIZATION_GUESTS,
  RouteId.ORGANIZATION_MEMBER_CARDS,
  RouteId.ORGANIZATION_MEMBERS,
  RouteId.ORGANIZATION_POWER_UPS,
  RouteId.ORGANIZATION_TABLES,
  RouteId.TEAM_GETTING_STARTED,
  RouteId.TEAM_HIGHLIGHTS,
  RouteId.TEAM_REPORTS,
];
// path starts with /b/:boardId/...
const boardRoutes = [RouteId.BOARD, RouteId.BOARD_REFERRAL];
// path starts with c/:cardId/...
const cardRoutes = [RouteId.CARD];

/** Determines the orgId (if any) for the current route */
export const useOrgIdFromRoute = (routePath: string) => {
  // Route types
  const routeId = getRouteIdFromPathname(routePath);
  const isMemberOrOrg = memberOrOrgRoutes.includes(routeId);
  const isBoard = boardRoutes.includes(routeId);
  const isCard = cardRoutes.includes(routeId);
  // Org ID query arg based on route type
  const [modelName, setModelName] = useState('');
  const [boardId, setBoardId] = useState('');
  const [cardId, setCardId] = useState('');
  // Org ID based on route type
  const orgIdFromModel = useOrgIdFromModel(modelName, routePath, routeId);
  const orgIdFromBoard = useOrgIdFromBoard(boardId);
  const orgIdFromCard = useOrgIdFromCard(cardId);

  const resetQueryArgs = () => {
    setModelName('');
    setBoardId('');
    setCardId('');
  };

  useEffect(() => {
    resetQueryArgs();

    const splitRoute = routePath.split('/');
    if (isMemberOrOrg) setModelName(splitRoute[1]);
    else if (isBoard) setBoardId(splitRoute[2]);
    else if (isCard) setCardId(splitRoute[2]);
  }, [routePath, isMemberOrOrg, isBoard, isCard]);

  return isMemberOrOrg
    ? orgIdFromModel
    : isBoard
    ? orgIdFromBoard
    : isCard
    ? orgIdFromCard
    : '';
};
