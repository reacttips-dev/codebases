/* eslint-disable import/no-default-export */
import { navigate } from 'app/scripts/controller/navigate';

import API from 'app/gamma/src/api';
import { normalizeBoard } from 'app/gamma/src/api/normalizers/board';
import { normalizeTeam } from 'app/gamma/src/api/normalizers/team';

import { TeamModel } from 'app/gamma/src/types/models';
import { Action, actionCreator, createReducer } from '@trello/redux';

// Action types
import {
  LOAD_BOARD_SUCCESS,
  LoadBoardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-board';
import {
  LOAD_HEADER_SUCCESS,
  LoadHeaderSuccessAction,
} from 'app/gamma/src/modules/loaders/load-header';
import {
  LOAD_MY_BOARDS_SUCCESS,
  LoadMyBoardsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-my-boards';
import {
  LOAD_TEAM_SUCCESS,
  LoadTeamSuccessAction,
} from 'app/gamma/src/modules/loaders/load-team';

import { Analytics } from '@trello/atlassian-analytics';
import {
  SOCKET_ORGANIZATION,
  SocketOrganizationAction,
} from 'app/gamma/src/modules/sockets';

import {
  SET_BOARD_CLOSED,
  SetBoardClosedAction,
} from 'app/gamma/src/modules/state/models/boards';
import {
  BoardResponse,
  LimitStatus,
  OrganizationsResponse,
} from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { HasRequiredKeys } from 'app/gamma/src/util/types';
import updateModelList from './util/updateModelList';
import { sendErrorEvent } from '@trello/error-reporting';

export const CREATE_TEAM_SUCCESS = Symbol('models/CREATE_TEAM_SUCCESS');
export const CREATE_TEAM_FAILURE = Symbol('models/CREATE_TEAM_FAILURE');

export enum TeamType {
  Default = 'default',
  Business = 'business',
  Enterprise = 'enterprise',
}

export type CreateTeamSuccessAction = Action<
  typeof CREATE_TEAM_SUCCESS,
  OrganizationsResponse
>;

export type TeamState = TeamModel[];

// Reducer
const initialState: TeamState = [];

const getOrganizationsFromBoards = (boards: BoardResponse[]) => {
  return boards
    .filter(
      (board): board is HasRequiredKeys<BoardResponse, 'organization'> =>
        !!board.organization,
    )
    .map((board) => board.organization);
};

const reduceOrganizationsPayload = (
  state: TeamModel[],
  organizations?: OrganizationsResponse | OrganizationsResponse[],
  boards?: BoardResponse[],
) => {
  if (!organizations) {
    return state;
  }

  // seed the state map with the current state
  const stateMap = new Map<string, TeamModel>(
    state.map<[string, TeamModel]>((team) => [team.id, team]),
  );

  // include any organizations that come from boards
  // NOTE: dropping these in first in case the organizations response
  //       has more fully populated organization properties
  if (boards) {
    getOrganizationsFromBoards(boards).forEach((organization) => {
      stateMap.set(
        organization.id,
        normalizeTeam(organization, stateMap.get(organization.id)),
      );
    });
  }

  // if it's not an array of orgs, we are either modifying or adding one team
  if (!Array.isArray(organizations)) {
    stateMap.set(
      organizations.id,
      normalizeTeam(organizations, stateMap.get(organizations.id)),
    );
  } else {
    // now include the organizations from the org response array
    organizations.forEach((organization) => {
      stateMap.set(
        organization.id,
        normalizeTeam(organization, stateMap.get(organization.id)),
      );
    });
  }

  return [...stateMap.values()];
};

const incrementFreeBoardLimitCount = (team: TeamModel): TeamModel => {
  if (
    !team ||
    !team.limits ||
    !team.limits.orgs.freeBoardsPerOrg.count ||
    closed
  ) {
    return team;
  }

  const { count, disableAt, warnAt } = team.limits.orgs.freeBoardsPerOrg;
  const newCount = count + 1;

  let newStatus: LimitStatus = 'ok';
  if (newCount > disableAt) {
    newStatus = 'maxExceeded';
  } else if (newCount === disableAt) {
    newStatus = 'disabled';
  } else if (newCount >= warnAt) {
    newStatus = 'warn';
  }

  return {
    ...team,
    limits: {
      ...team.limits,
      orgs: {
        ...team.limits.orgs,
        freeBoardsPerOrg: {
          ...team.limits.orgs.freeBoardsPerOrg,
          count: newCount,
          status: newStatus,
        },
      },
    },
  };
};

export default createReducer(initialState, {
  [LOAD_MY_BOARDS_SUCCESS](state, { payload }: LoadMyBoardsSuccessAction) {
    const organizations = reduceOrganizationsPayload(
      state,
      payload.organizations,
      payload.boards,
    );

    return organizations;
  },

  [LOAD_BOARD_SUCCESS](state, { payload }: LoadBoardSuccessAction) {
    return reduceOrganizationsPayload(state, payload.organization);
  },

  [LOAD_TEAM_SUCCESS](state, { payload }: LoadTeamSuccessAction) {
    return reduceOrganizationsPayload(state, payload);
  },

  [LOAD_HEADER_SUCCESS](state, { payload }: LoadHeaderSuccessAction) {
    return reduceOrganizationsPayload(state, payload.organizations);
  },

  [CREATE_TEAM_SUCCESS](state, { payload }: CreateTeamSuccessAction) {
    return updateModelList(state, payload, normalizeTeam);
  },

  [CREATE_TEAM_FAILURE](state, { message }: Error) {
    // TODO: handle this failure

    return state;
  },
  [SET_BOARD_CLOSED](state, { payload }: SetBoardClosedAction) {
    const { closed, idTeam } = normalizeBoard(payload);

    return state.map((team) =>
      !closed && team.id === idTeam ? incrementFreeBoardLimitCount(team) : team,
    );
  },

  [SOCKET_ORGANIZATION](state, { payload }: SocketOrganizationAction) {
    return updateModelList(state, payload, normalizeTeam);
  },
});

interface CreateTeamRequest {
  type: TeamType;
  displayName: string;
  teamType?: string;
  desc?: string;
  enterprise?: string;
  redirectAfterCreate?: boolean;
}

interface CreateTeamSuccess {
  type: TeamType;
  team: OrganizationsResponse;
}

// Action creators
export const onSubmitCreateTeamSuccess = ({
  type,
  team,
}: CreateTeamSuccess): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    const { name } = team;
    switch (type) {
      case TeamType.Business:
        navigate(`/${name}/billing`, { trigger: true });
        break;
      case TeamType.Enterprise:
        navigate(`/${name}/account`, { trigger: true });
        break;
      default:
        navigate(`/${name}`, { trigger: true });
    }
  };
};

export const submitCreateTeam = ({
  type,
  redirectAfterCreate,
  ...details
}: CreateTeamRequest): StandardThunkAction<
  Promise<OrganizationsResponse | void>
> => {
  return async (dispatch: Dispatch) => {
    try {
      const team = await API.client.rest.post<OrganizationsResponse>(
        'organizations',
        {
          body: details,
        },
      );
      dispatch(actionCreator(CREATE_TEAM_SUCCESS)(team));
      if (redirectAfterCreate) {
        dispatch(onSubmitCreateTeamSuccess({ type, team }));
      }

      Analytics.sendTrackEvent({
        action: 'created',
        actionSubject: 'workspace',
        source: 'createWorkspaceInlineDialog',
        containers: {
          organization: {
            id: team.id,
          },
        },
        attributes: {
          orgType: type,
        },
      });

      return team;
    } catch (err) {
      dispatch(actionCreator(CREATE_TEAM_FAILURE)(err));
      sendErrorEvent(err, {
        tags: { ownershipArea: 'trello-bizteam' },
      });
    }
  };
};
