import { chain } from 'underscore';
import Backgrounds, { BackgroundType } from 'app/src/backgrounds';
import { BackgroundItemState } from 'app/gamma/src/modules/state/ui/create-menu';
import { State } from 'app/gamma/src/modules/types';
import { isTeamAdmin } from 'app/gamma/src/selectors/members';
import {
  getEnterpriseWithPermissions,
  isAdminOfEnterpriseTeams,
} from 'app/gamma/src/selectors/enterprises';
import {
  TeamModel,
  BoardModel,
  AccessLevel,
  BoardPermissionLevel,
} from 'app/gamma/src/types/models';
import { freeBoardsRemaining } from 'app/gamma/src/util/model-helpers/team';
import {
  getOrgsWithPermissions,
  OrgWithPermissions,
  getMyTeamByName,
  getMyTeamById,
} from './teams';
import { isPossiblyValidOrgName } from '@trello/organizations';

export const getCreateMenu = (state: State) => state.ui.createMenu;
export const getCreateBoardMenu = (state: State) => getCreateMenu(state).board;
export const getCreateBoardSelectedTeam = (
  state: State,
): OrgWithPermissions | null => {
  if (state.ui.createMenu.board.selectedTeamId) {
    return (
      getOrgsWithPermissions(state).find(
        (org) => org.model.id === state.ui.createMenu.board.selectedTeamId,
      ) || null
    );
  }
  return null;
};
export const getCreateBoardBestTeam = (
  state: State,
): OrgWithPermissions | null => {
  // First see if there are teams with limits that are close to their
  // board limit threshold
  const teams: TeamModel[] = state.models.teams;

  const bestOrg = chain(teams)
    .filter((team) => freeBoardsRemaining(team) !== undefined)
    .sortBy((team) => freeBoardsRemaining(team))
    .first()
    .value();

  if (bestOrg) {
    const org = getOrgsWithPermissions(state).find(
      (o) => o.model.id === bestOrg.id,
    );
    if (org) {
      return org;
    }
  }

  // If not, fall back to team with the most boards
  const boards: BoardModel[] = state.models.boards;

  const teamBoards = chain(boards)
    .filter((board) => !!board.idTeam)
    .groupBy((board) => board.idTeam)
    .sortBy((groupedBoards) => groupedBoards.length)
    .last()
    .value();

  if (teamBoards && teamBoards.length > 0) {
    const org = getOrgsWithPermissions(state).find(
      (o) => o.model.id === teamBoards[0].idTeam,
    );
    if (org) {
      return org;
    }
  }

  // lastly, default to some organization if one is available
  return getOrgsWithPermissions(state)[0] || null;
};
export const getCreateBoardDisallowed = (state: State): boolean => {
  const selectedTeam = getCreateBoardSelectedTeam(state);
  let isAdmin = false;
  let boardRestrictions;
  if (selectedTeam) {
    isAdmin = isTeamAdmin(state, selectedTeam.model);
    boardRestrictions =
      selectedTeam.model.prefs &&
      selectedTeam.model.prefs.boardVisibilityRestrict &&
      Object.keys(selectedTeam.model.prefs.boardVisibilityRestrict)
        .filter(
          (key) =>
            key !== AccessLevel.Enterprise || !!selectedTeam.model.idEnterprise,
        )
        .map(
          (key) =>
            selectedTeam.model.prefs &&
            selectedTeam.model.prefs.boardVisibilityRestrict[key],
        );
  } else {
    const enterprise = getEnterpriseWithPermissions(state);
    isAdmin = !!enterprise && isAdminOfEnterpriseTeams(state, enterprise.model);
    boardRestrictions =
      enterprise &&
      enterprise.model.organizationPrefs &&
      enterprise.model.organizationPrefs.boardVisibilityRestrict &&
      [AccessLevel.Private, AccessLevel.Public].map((key) =>
        enterprise.model.organizationPrefs &&
        enterprise.model.organizationPrefs.boardVisibilityRestrict[key]
          ? enterprise.model.organizationPrefs.boardVisibilityRestrict[key]
          : AccessLevel.Org,
      );
  }

  // this is true if board creation for all visibility types is set to 'none'
  const allDisallowed =
    !!boardRestrictions &&
    boardRestrictions.every((val) => val === AccessLevel.None);

  // this is true if board creation for none of the visibility types is set to 'org'
  const onlyAdminsAllowed =
    !!boardRestrictions &&
    boardRestrictions.every((val) => val !== AccessLevel.Org);

  return allDisallowed || (!isAdmin && onlyAdminsAllowed);
};

export const getCreateBoardMenuBackgroundItemSelected = (state: State) => {
  const background = getCreateBoardMenu(state).background;
  return background.selected.id ? background.selected : background.preSelected;
};

export const getCreateBoardMenuBackgroundItemShifted = (state: State) => {
  const background = getCreateBoardMenu(state).background;
  return background.shifted;
};

export const getCreateBoardMenuBackgroundStyle = (
  state: State,
): { backgroundColor: string; backgroundImage: string | undefined } => {
  const createBoardState = getCreateBoardMenu(state);
  const photos = createBoardState.photos;
  const { selected, preSelected } = createBoardState.background;
  const bgData: BackgroundItemState = {
    ...(selected.id ? selected : preSelected),
  };

  if (bgData.type === BackgroundType.Unsplash) {
    const photo = photos.find(({ id }) => id === bgData.id);

    return {
      backgroundColor: Backgrounds.colors.blue.color,
      backgroundImage: photo && `url(${photo.urls.small})`,
    };
  }

  if (bgData.type === BackgroundType.Gradient) {
    const gradient = Backgrounds.gradients[bgData.id!];

    return {
      backgroundColor: gradient.color,
      backgroundImage: `url(${gradient.path})`,
    };
  }

  return {
    backgroundColor: Backgrounds.colors[bgData.id!].color,
    backgroundImage: undefined,
  };
};

export const getCreateBoardSelectedVisibility = (
  state: State,
): BoardPermissionLevel | null => {
  const { selectedTeamId, selectedVisibility } = getCreateBoardMenu(state);
  const getDefaultVisibility = (
    allowedVis: BoardPermissionLevel[],
    level: BoardPermissionLevel,
  ) => {
    if (allowedVis.includes(level)) {
      return level;
    } else if (allowedVis.includes(AccessLevel.Enterprise)) {
      return AccessLevel.Enterprise;
    } else {
      return allowedVis[0] || null;
    }
  };
  const team =
    !!selectedTeamId &&
    getOrgsWithPermissions(state).find(
      (org) => org.model.id === selectedTeamId,
    );

  const entOrOrg = team ? team : getEnterpriseWithPermissions(state);

  if (entOrOrg) {
    if (selectedVisibility) {
      if (!entOrOrg.allowedVis.includes(selectedVisibility)) {
        return getDefaultVisibility(entOrOrg.allowedVis, AccessLevel.Private);
      }

      return selectedVisibility;
    }

    return getDefaultVisibility(entOrOrg.allowedVis, AccessLevel.Org);
  }

  return selectedVisibility === AccessLevel.Public
    ? selectedVisibility
    : AccessLevel.Private;
};

export const getTeamByOrgRoute = (state: State): OrgWithPermissions | null => {
  const pathname = window.location.pathname;
  const match = pathname.match(/\/([^/]+)\/?([^/]+)?/);

  if (!match) {
    return null;
  }

  const orgName = match[1];

  if (!isPossiblyValidOrgName(orgName)) {
    return null;
  }

  const team = getMyTeamByName(state, orgName);

  if (team) {
    return (
      getOrgsWithPermissions(state).find((org) => org.model.id === team.id) ||
      null
    );
  }
  return null;
};

export const getCreateBoardTeamById = (
  state: State,
  teamId: string,
): OrgWithPermissions | null => {
  const team = getMyTeamById(state, teamId);

  if (team) {
    return (
      getOrgsWithPermissions(state).find((org) => org.model.id === team.id) ||
      null
    );
  }

  return null;
};
