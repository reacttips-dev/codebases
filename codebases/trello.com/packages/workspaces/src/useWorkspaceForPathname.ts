import { getRouteIdFromPathname, routes, RouteId } from '@trello/routes';

import { useWorkspaceForBoardQuery } from './WorkspaceForBoardQuery.generated';
import { useWorkspaceForCardQuery } from './WorkspaceForCardQuery.generated';
import { useWorkspaceForOrganizationViewQuery } from './WorkspaceForOrganizationViewQuery.generated';
import { useWorkspaceForOrganizationQuery } from './WorkspaceForOrganizationQuery.generated';
import { WorkspaceState } from './workspaceState';

interface RouteState {
  type: 'BOARD' | 'CARD' | 'ORGANIZATION_VIEW' | 'ORGANIZATION' | 'GLOBAL';
  idBoard?: string;
  idCard?: string;
  organizationName?: string;
  idOrganizationView?: string;
}

interface RouteStateGetter {
  (...args: string[]): RouteState;
}

function getBoardRouteState(idBoard: string): RouteState {
  return { type: 'BOARD', idBoard };
}

function getCardRouteState(idCard: string): RouteState {
  return { type: 'CARD', idCard };
}

function getOrganizationViewRouteState(idOrganizationView: string): RouteState {
  return { type: 'ORGANIZATION_VIEW', idOrganizationView };
}

function getOrganizationRouteState(organizationName: string): RouteState {
  return { type: 'ORGANIZATION', organizationName };
}

function getGlobalRouteState(): RouteState {
  return { type: 'GLOBAL' };
}

export const routeMap: Record<RouteId, RouteStateGetter> = {
  [RouteId.BOARD]: getBoardRouteState,

  [RouteId.BOARD_OLD]: (path: string) => {
    const parts = path.split('/');
    const idBoard = parts.length > 1 ? parts[1] : parts[0];
    return getBoardRouteState(idBoard);
  },

  [RouteId.BOARD_REFERRAL]: getBoardRouteState,

  [RouteId.CARD_OLD]: (...params: string[]) => {
    const idBoard = params.length > 2 ? params[1] : params[0];
    return getBoardRouteState(idBoard);
  },

  [RouteId.CARD_AND_BOARD_OLD]: (...params: string[]) => {
    const idBoard = params.length > 2 ? params[1] : params[0];
    return getBoardRouteState(idBoard);
  },

  [RouteId.CARD]: getCardRouteState,

  [RouteId.WORKSPACE_DEFAULT_MY_WORK_VIEW]: getOrganizationRouteState,
  [RouteId.WORKSPACE_VIEW]: getOrganizationViewRouteState,
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]: getOrganizationRouteState,
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]: getOrganizationRouteState,

  [RouteId.ACCOUNT]: getOrganizationRouteState,
  [RouteId.BILLING]: getOrganizationRouteState,
  [RouteId.MEMBER_CARDS_FOR_ORG]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_BY_ID]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_EXPORT]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_FREE_TRIAL]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_GUESTS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_MEMBER_CARDS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_MEMBERS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_POWER_UPS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_TABLES]: getOrganizationRouteState,
  [RouteId.PROFILE]: getOrganizationRouteState,
  [RouteId.USER_OR_ORG]: getOrganizationRouteState,

  [RouteId.BILLING_CARD_PRODUCT]: getGlobalRouteState,
  [RouteId.BILLING_CARD]: getGlobalRouteState,
  [RouteId.BLANK]: getGlobalRouteState,
  [RouteId.CREATE_FIRST_BOARD]: getGlobalRouteState,
  [RouteId.CREATE_FIRST_TEAM]: getGlobalRouteState,
  [RouteId.DOUBLE_SLASH]: getGlobalRouteState,
  [RouteId.ENTERPRISE_ADMIN_TAB]: getGlobalRouteState,
  [RouteId.ENTERPRISE_ADMIN]: getGlobalRouteState,
  [RouteId.ERROR_PAGE]: getGlobalRouteState,
  [RouteId.GO]: getGlobalRouteState,
  [RouteId.GOLD_PROMO_FREE_TRIAL]: getGlobalRouteState,
  [RouteId.INVITE_ACCEPT_BOARD]: getGlobalRouteState,
  [RouteId.INVITE_ACCEPT_TEAM]: getGlobalRouteState,
  [RouteId.MEMBER_ACTIVITY]: getGlobalRouteState,
  [RouteId.MEMBER_ALL_BOARDS]: getGlobalRouteState,
  [RouteId.MEMBER_CARDS]: getGlobalRouteState,
  [RouteId.MEMBER_HOME]: getGlobalRouteState,
  [RouteId.MEMBER_HOME_BOARDS]: getGlobalRouteState,
  [RouteId.MEMBER_TASKS]: getGlobalRouteState,
  [RouteId.POWER_UP_ADMIN]: getGlobalRouteState,
  [RouteId.POWER_UP_EDIT]: getGlobalRouteState,
  [RouteId.POWER_UP_PUBLIC_DIRECTORY]: getGlobalRouteState,
  [RouteId.SEARCH]: getGlobalRouteState,
  [RouteId.SELECT_ORG_TO_UPGRADE]: getGlobalRouteState,
  [RouteId.SELECT_TEAM_TO_UPGRADE]: getGlobalRouteState,
  [RouteId.SHORTCUTS_OVERLAY]: getGlobalRouteState,
  [RouteId.SHORTCUTS]: getGlobalRouteState,
  [RouteId.TEAM_GETTING_STARTED]: getGlobalRouteState,
  [RouteId.TEAM_HIGHLIGHTS]: getGlobalRouteState,
  [RouteId.TEAM_REPORTS]: getGlobalRouteState,
  [RouteId.TEMPLATES_RECOMMEND]: getGlobalRouteState,
  [RouteId.TEMPLATES_SUBMIT]: getGlobalRouteState,
  [RouteId.TEMPLATES]: getGlobalRouteState,
  [RouteId.TO]: getGlobalRouteState,
};

export function useWorkspaceForPathname(pathname: string): WorkspaceState {
  const routeId = getRouteIdFromPathname(pathname);
  const getter = routeMap[routeId];
  const match = routes[routeId].regExp.exec(pathname.slice(1));
  const params = match?.slice(1) ?? [];

  const {
    type,
    idOrganizationView: idOrganizationViewFromPathname,
    organizationName,
    idBoard: idBoardFromPathname,
    idCard: idCardFromPathname,
  } = getter(...params);

  const { data: boardData, loading: boardLoading } = useWorkspaceForBoardQuery({
    variables: {
      idBoard: idBoardFromPathname ?? '',
    },
    skip: type !== 'BOARD',
    // This property is required to prevent the hook from getting stuck in a loading state
    // for more detail: https://hello.atlassian.net/wiki/spaces/TRELLO/pages/1006320263/Bug+in+apollo+react-hooks+useQuery+stuck+in+loading+state
    // TODO: Try to remove this after FE-Plat upgrades to @apollo/client
    notifyOnNetworkStatusChange: true,
  });

  const { data: cardData, loading: cardLoading } = useWorkspaceForCardQuery({
    variables: {
      idCard: idCardFromPathname ?? '',
    },
    skip: type !== 'CARD',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: organizationViewData,
    loading: organizationViewLoading,
  } = useWorkspaceForOrganizationViewQuery({
    variables: {
      idOrganizationView: idOrganizationViewFromPathname ?? '',
    },
    skip: type !== 'ORGANIZATION_VIEW',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: organizationData,
    loading: organizationLoading,
  } = useWorkspaceForOrganizationQuery({
    variables: {
      name: organizationName ?? '',
    },
    skip: type !== 'ORGANIZATION',
    notifyOnNetworkStatusChange: true,
  });

  let isGlobal = type === 'GLOBAL';
  let idWorkspace: string | null,
    isLoading: boolean,
    idBoard: string | null,
    idCard: string | null,
    idWorkspaceView: string | null;
  switch (type) {
    case 'BOARD':
      idWorkspace = boardData?.board?.idOrganization ?? null;
      isLoading = boardLoading;
      idBoard = boardData?.board?.id ?? null;
      idCard = null;
      idWorkspaceView = null;
      break;
    case 'CARD':
      idWorkspace = cardData?.card?.board?.idOrganization ?? null;
      isLoading = cardLoading;
      idBoard = cardData?.card?.board?.id ?? null;
      idCard = cardData?.card?.id ?? null;
      idWorkspaceView = null;
      break;
    case 'ORGANIZATION_VIEW':
      idWorkspace =
        organizationViewData?.organizationView?.idOrganization ?? null;
      isLoading = organizationViewLoading;
      idBoard = null;
      idCard = null;
      idWorkspaceView = organizationViewData?.organizationView?.id ?? null;
      break;
    case 'ORGANIZATION':
      idWorkspace = organizationData?.organization?.id ?? null;
      isLoading = organizationLoading;
      idBoard = null;
      idCard = null;
      idWorkspaceView = null;

      // If there is no idWorkspace on the USER_OR_ORG route then it means we
      // are on the USER route which should be a global page
      // If there is no idWorkspace on the ACCOUNT route then it means we are
      // on the users account settins page which should be a global page
      // If there is no idWorkspace on the PROFILE route then it means we are
      // on the users profile page which should be a global page
      // If there is no idWorkspace on the BILLING route then it means we are
      // on the users billing page which should be a global page
      if (
        !isLoading &&
        (routeId === RouteId.USER_OR_ORG ||
          routeId === RouteId.ACCOUNT ||
          routeId === RouteId.PROFILE ||
          routeId === RouteId.BILLING) &&
        !idWorkspace
      ) {
        isGlobal = true;
      }

      break;
    case 'GLOBAL':
    default:
      idWorkspace = null;
      isLoading = false;
      idBoard = null;
      idCard = null;
      idWorkspaceView = null;
      break;
  }

  return {
    idWorkspace,
    isLoading,
    isGlobal,
    idBoard,
    idCard,
    idWorkspaceView,
  };
}
