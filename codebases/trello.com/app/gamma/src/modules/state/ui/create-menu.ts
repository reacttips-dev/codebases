/* eslint-disable import/no-default-export */
/**
 * Based on app/scripts/views/board-create/helpers
 */

import { navigate } from 'app/scripts/controller/navigate';

import _ from 'underscore';

import api from 'app/gamma/src/api';
import { unsplashClient, Photo } from '@trello/unsplash';
import { BackgroundType } from 'app/src/backgrounds';
import { ProductFeatures } from '@trello/product-features';
import { loadTeam } from 'app/gamma/src/modules/loaders/load-team';
import { State } from 'app/gamma/src/modules/types';
import {
  getBoardsMenuSearchText,
  getMyOwnedBoards,
  isWelcomeBoard,
} from 'app/gamma/src/selectors/boards';
import {
  getCreateBoardMenu,
  getCreateBoardMenuBackgroundItemSelected,
  getCreateBoardSelectedVisibility,
  getCreateBoardBestTeam,
  getCreateBoardSelectedTeam,
  getTeamByOrgRoute,
  getCreateBoardTeamById,
} from 'app/gamma/src/selectors/create-menu';
import { getMyTeams, getTeamById } from 'app/gamma/src/selectors/teams';
import { BoardResponse } from 'app/gamma/src/types/responses';
import {
  AccessLevel,
  BoardModel,
  BoardPermissionLevel,
  TeamModel,
} from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator, createReducer } from '@trello/redux';
import { getMilliseconds } from '@trello/time';
import waitForImageLoad from 'app/gamma/src/util/wait-for-image-load';
import { removeOverlay } from './overlay';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';

const { PAGE_SIZE } = unsplashClient.constants;
const PRELOAD_PHOTOS_PAGE_SIZE = 6;

// eslint-disable-next-line @trello/no-module-logic
const PRELOAD_PHOTO_EXPIRATION = getMilliseconds({ hours: 1 });
// eslint-disable-next-line @trello/no-module-logic
const PRELOAD_PERMISSION_EXPIRATION = getMilliseconds({ minutes: 1 });

export const PERSONAL_VIS_OPTIONS = [AccessLevel.Private, AccessLevel.Public];
export const ORG_VIS_OPTIONS = [
  AccessLevel.Private,
  AccessLevel.Org,
  AccessLevel.Public,
];
export const ENTERPRISE_VIS_OPTIONS = [
  AccessLevel.Private,
  AccessLevel.Org,
  AccessLevel.Enterprise,
  AccessLevel.Public,
];

const CREATE_BOARD_KEEP_FROM_SOURCE = Symbol('CREATE_BOARD_KEEP_FROM_SOURCE');
const CREATE_BOARD_SET_NAME = Symbol('CREATE_BOARD_SET_NAME');
const CREATE_BOARD_SET_CURRENT_PHOTOS_QUERY = Symbol(
  'CREATE_BOARD_SET_CURRENT_PHOTOS_QUERY',
);
const CREATE_BOARD_SELECT_TEAM = Symbol('CREATE_BOARD_SELECT_TEAM');
const CREATE_BOARD_SELECT_BACKGROUND = Symbol('CREATE_BOARD_SELECT_BACKGROUND');
const CREATE_BOARD_SHIFT_BACKGROUND = Symbol('CREATE_BOARD_SHIFT_BACKGROUND');
const CREATE_BOARD_UNSHIFT_BACKGROUND = Symbol(
  'CREATE_BOARD_UNSHIFT_BACKGROUND',
);
const CREATE_BOARD_RESET = Symbol('CREATE_BOARD_RESET');
const PRELOAD_CREATE_BOARD_DATA_INIT = Symbol('PRELOAD_CREATE_BOARD_DATA_INIT');
const PRELOAD_CREATE_BOARD_DATA_DONE = Symbol('PRELOAD_CREATE_BOARD_DATA_DONE');
const CREATE_BOARD_SELECT_VISIBILITY = Symbol('CREATE_BOARD_SELECT_VISIBILITY');
const CREATE_BOARD_LOAD_PHOTOS_INIT = Symbol('CREATE_BOARD_LOAD_PHOTOS_INIT');
const CREATE_BOARD_LOAD_PHOTOS_DONE = Symbol('CREATE_BOARD_LOAD_PHOTOS_DONE');
const CREATE_BOARD_SUBMIT_INIT = Symbol('CREATE_BOARD_SUBMIT_INIT');
export const CREATE_BOARD_SUBMIT_DONE = Symbol('CREATE_BOARD_SUBMIT_DONE');

interface TrackingOptions {
  method?: string;
}

type CreateBoardSetNameAction = Action<typeof CREATE_BOARD_SET_NAME, string>;

type CreateBoardKeepFromSourceAction = Action<
  typeof CREATE_BOARD_KEEP_FROM_SOURCE,
  string[]
>;

type CreateBoardSetCurrentPhotosQueryAction = Action<
  typeof CREATE_BOARD_SET_CURRENT_PHOTOS_QUERY,
  string
>;

type CreateBoardSelectTeamAction = Action<
  typeof CREATE_BOARD_SELECT_TEAM,
  string | null
>;

type CreateBoardSelectBackgroundAction = Action<
  typeof CREATE_BOARD_SELECT_BACKGROUND,
  BackgroundItemState
>;

type CreateBoardShiftBackgroundAction = Action<
  typeof CREATE_BOARD_SHIFT_BACKGROUND,
  BackgroundItemState
>;

type CreateBoardUnhiftBackgroundAction = Action<
  typeof CREATE_BOARD_UNSHIFT_BACKGROUND,
  null
>;

type CreateBoardResetAction = Action<typeof CREATE_BOARD_RESET, null>;

type PreloadCreateBoardDataInitAction = Action<
  typeof PRELOAD_CREATE_BOARD_DATA_INIT,
  null
>;

type PreloadCreateBoardDataDoneAction = Action<
  typeof PRELOAD_CREATE_BOARD_DATA_DONE,
  {
    photos?: Photo[];
    isLoadingPhotos?: boolean;
    isLoadingVizPermissions?: boolean;
  }
>;

type CreateBoardLoadPhotosInitAction = Action<
  typeof CREATE_BOARD_LOAD_PHOTOS_INIT,
  {
    query: string;
  }
>;

type CreateBoardLoadPhotosDoneAction = Action<
  typeof CREATE_BOARD_LOAD_PHOTOS_DONE,
  {
    photos: Photo[];
    hasLoadingError: boolean;
    hasMorePhotos: boolean;
  }
>;

type CreateBoardSelectVisibilityAction = Action<
  typeof CREATE_BOARD_SELECT_VISIBILITY,
  BoardPermissionLevel
>;

type CreateBoardSubmitInitAction = Action<
  typeof CREATE_BOARD_SUBMIT_INIT,
  null
>;

export type CreateBoardSubmitDoneAction = Action<
  typeof CREATE_BOARD_SUBMIT_DONE,
  BoardResponse | null
>;

export interface BackgroundItemState {
  type:
    | BackgroundType.Color
    | BackgroundType.Gradient
    | BackgroundType.Unsplash
    | null;
  id: string | null;
}

export interface BackgroundState {
  selected: BackgroundItemState;
  preSelected: BackgroundItemState;
  shifted: BackgroundItemState;
}

export interface CreateMenuState {
  board: {
    currentPhotosPage: number;
    currentPhotosQuery: string;
    background: BackgroundState;
    name: string;
    isCreatingBoard: boolean;
    isLoadingPhotos: boolean;
    hasLoadingError: boolean;
    hasMorePhotos: boolean;
    isLoadingVizPermissions: boolean;
    keepFromSource: string[];
    photos: Photo[];
    selectedTeamId: string | null;
    selectedVisibility: BoardPermissionLevel | null;
  };
}

const initialState: CreateMenuState = {
  board: {
    currentPhotosPage: 0,
    currentPhotosQuery: '',
    hasMorePhotos: true,
    hasLoadingError: false,
    background: {
      preSelected: {
        type: BackgroundType.Color,
        id: 'blue',
      },
      selected: {
        type: null,
        id: null,
      },
      shifted: {
        type: null,
        id: null,
      },
    },
    name: '',
    isCreatingBoard: false,
    isLoadingPhotos: true,
    isLoadingVizPermissions: true,
    photos: [],
    selectedTeamId: null,
    selectedVisibility: null,
    keepFromSource: ['cards'],
  },
};

export default createReducer(initialState, {
  [CREATE_BOARD_KEEP_FROM_SOURCE](
    state: CreateMenuState,
    { payload: keepFromSource }: CreateBoardSelectTeamAction,
  ) {
    return {
      ...state,
      board: {
        ...state.board,
        keepFromSource,
      },
    };
  },
  [CREATE_BOARD_SET_NAME](
    state: CreateMenuState,
    { payload: name }: CreateBoardSetNameAction,
  ) {
    return {
      ...state,
      board: {
        ...state.board,
        name,
      },
    };
  },
  [CREATE_BOARD_SELECT_TEAM](
    state: CreateMenuState,
    { payload: selectedTeamId }: CreateBoardSelectTeamAction,
  ) {
    return {
      ...state,
      board: {
        ...state.board,
        selectedTeamId,
      },
    };
  },
  [CREATE_BOARD_SELECT_BACKGROUND](
    state: CreateMenuState,
    { payload }: CreateBoardSelectBackgroundAction,
  ) {
    return {
      ...state,
      board: {
        ...state.board,
        background: {
          ...state.board.background,
          selected: payload,
        },
      },
    };
  },
  [CREATE_BOARD_SHIFT_BACKGROUND](
    state: CreateMenuState,
    { payload }: CreateBoardShiftBackgroundAction,
  ) {
    return {
      ...state,
      board: {
        ...state.board,
        background: {
          ...state.board.background,
          shifted: payload,
        },
      },
    };
  },
  [CREATE_BOARD_UNSHIFT_BACKGROUND](state: CreateMenuState) {
    return {
      ...state,
      board: {
        ...state.board,
        background: {
          ...state.board.background,
          shifted: {
            id: null,
            type: null,
          },
        },
      },
    };
  },
  [CREATE_BOARD_RESET](state: CreateMenuState) {
    return {
      ...state,
      board: { ...initialState.board, selectedTeamId: null },
    };
  },
  [PRELOAD_CREATE_BOARD_DATA_INIT](state: CreateMenuState) {
    return {
      ...state,
      board: {
        ...state.board,
        isLoadingPhotos: true,
        isLoadingVizPermissions: true,
      },
    };
  },
  [PRELOAD_CREATE_BOARD_DATA_DONE](
    state: CreateMenuState,
    { payload }: PreloadCreateBoardDataDoneAction,
  ) {
    const { photos } = payload;
    const { preSelected } = state.board.background;

    if (photos && photos[0]) {
      preSelected.type = BackgroundType.Unsplash;
      preSelected.id = photos[0].id;
    }

    return {
      ...state,
      board: {
        ...state.board,
        ...payload,
      },
    };
  },
  [CREATE_BOARD_LOAD_PHOTOS_INIT](
    state: CreateMenuState,
    { payload }: CreateBoardLoadPhotosInitAction,
  ) {
    const { query } = payload;
    if (query === state.board.currentPhotosQuery) {
      return {
        ...state,
        board: {
          ...state.board,
          isLoadingPhotos: true,
        },
      };
    }

    // Reset the result set for the new query. Only keep the selected
    // photo if the user selected one before changing the query, or the
    // preselected photo if the user hasn't made a selection yet.
    const { selected, preSelected } = state.board.background;
    const photosToKeep = state.board.photos.filter(
      (photo) =>
        photo.id === selected.id ||
        (photo.id === preSelected.id && selected.id === null),
    );

    return {
      ...state,
      board: {
        ...state.board,
        photos: photosToKeep,
        currentPhotosPage: 0,
        currentPhotosQuery: query,
        isLoadingPhotos: true,
      },
    };
  },
  [CREATE_BOARD_LOAD_PHOTOS_DONE](
    state: CreateMenuState,
    { payload }: CreateBoardLoadPhotosDoneAction,
  ) {
    const { currentPhotosPage } = state.board;
    const { hasLoadingError, hasMorePhotos, photos } = payload;

    // filter out photos which might already have loaded
    const newPhotos = (photos || []).filter(
      (photo) =>
        !state.board.photos.find((existing) => existing.id === photo.id),
    );
    const combinedPhotos = [...state.board.photos, ...newPhotos];

    return {
      ...state,
      board: {
        ...state.board,
        currentPhotosPage: currentPhotosPage + 1,
        photos: combinedPhotos,
        isLoadingPhotos: false,
        hasLoadingError,
        hasMorePhotos,
      },
    };
  },
  [CREATE_BOARD_SELECT_VISIBILITY](
    state: CreateMenuState,
    { payload: selectedVisibility }: CreateBoardSelectVisibilityAction,
  ) {
    return {
      ...state,
      board: {
        ...state.board,
        selectedVisibility,
      },
    };
  },
  [CREATE_BOARD_SUBMIT_INIT](state: CreateMenuState) {
    return {
      ...state,
      board: {
        ...state.board,
        isCreatingBoard: true,
      },
    };
  },
  [CREATE_BOARD_SUBMIT_DONE](state: CreateMenuState) {
    return {
      ...state,
      board: {
        ...state.board,
        isCreatingBoard: false,
      },
    };
  },
});

export const createBoardSetName = actionCreator<CreateBoardSetNameAction>(
  CREATE_BOARD_SET_NAME,
);

export const createBoardKeepFromSource = actionCreator<CreateBoardKeepFromSourceAction>(
  CREATE_BOARD_KEEP_FROM_SOURCE,
);

export const createBoardSetCurrentPhotosQuery = actionCreator<CreateBoardSetCurrentPhotosQueryAction>(
  CREATE_BOARD_SET_CURRENT_PHOTOS_QUERY,
);

export const createBoardSetNameFromSearch = () => (
  dispatch: Dispatch,
  getState: () => State,
) => dispatch(createBoardSetName(getBoardsMenuSearchText(getState())));

export const createBoardSelectTeam = actionCreator<CreateBoardSelectTeamAction>(
  CREATE_BOARD_SELECT_TEAM,
);
export const createBoardSelectBackground = actionCreator<CreateBoardSelectBackgroundAction>(
  CREATE_BOARD_SELECT_BACKGROUND,
);
export const createBoardShiftBackground = actionCreator<CreateBoardShiftBackgroundAction>(
  CREATE_BOARD_SHIFT_BACKGROUND,
);
export const createBoardUnshiftBackground = actionCreator<CreateBoardUnhiftBackgroundAction>(
  CREATE_BOARD_UNSHIFT_BACKGROUND,
);
export const createBoardReset = actionCreator<CreateBoardResetAction>(
  CREATE_BOARD_RESET,
);

// Expire memoization cache so we don't keep stale responses around too long
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delayedExpireMemoizedCache = (fn: any, ms = 0) =>
  setTimeout(() => (fn.cache = {}), ms);

const preloadPermissions = _.memoize(
  (teams: TeamModel[], dispatch: Dispatch, getState: () => State) => {
    delayedExpireMemoizedCache(
      preloadPermissions,
      PRELOAD_PERMISSION_EXPIRATION,
    );

    return Promise.all(
      teams.map(async (org) => {
        // at this moment, we are querying all data from teams,
        // so this is hardly ever gonna be called
        if (
          !ProductFeatures.isFeatureEnabled(
            'restrictVis',
            org.products && org.products[0],
          )
        ) {
          await dispatch(loadTeam(org.id));
        }

        return Promise.resolve(getTeamById(getState(), org.id));
      }),
    );
  },
);

const preloadPhotos = _.memoize(() => {
  delayedExpireMemoizedCache(preloadPhotos, PRELOAD_PHOTO_EXPIRATION);

  return unsplashClient
    .getDefaultCollectionPhotos(1, PRELOAD_PHOTOS_PAGE_SIZE, 'latest')
    .then((photos: Photo[]) =>
      // Preload photos visible on initial create board screen then resolve with the initial response
      Promise.all(
        photos.map((photo) => waitForImageLoad(photo.urls.small)),
      ).then(() => photos),
    );
}) as () => Promise<Photo[]>; // We need Unsplash types. This is a patch.

const loadMorePhotos = (query = '', page = 1): Promise<Photo[]> => {
  // Either use the search API or the latest top picks based
  // on whether a query was provided
  const photosPromise: Promise<Photo[]> =
    query !== ''
      ? unsplashClient.searchPhotos(query, page)
      : unsplashClient.getDefaultCollectionPhotos(page);

  // Preload photos visible on initial create board screen then resolve with the initial response
  return photosPromise.then((photos) =>
    Promise.all(photos.map((photo) => waitForImageLoad(photo.urls.small))).then(
      () => photos,
    ),
  );
};

const preloadCreateBoardDataInit = actionCreator<PreloadCreateBoardDataInitAction>(
  PRELOAD_CREATE_BOARD_DATA_INIT,
);
const preloadCreateBoardDataDone = actionCreator<PreloadCreateBoardDataDoneAction>(
  PRELOAD_CREATE_BOARD_DATA_DONE,
);
const loadMorePhotosInit = actionCreator<CreateBoardLoadPhotosInitAction>(
  CREATE_BOARD_LOAD_PHOTOS_INIT,
);
const loadMorePhotosDone = actionCreator<CreateBoardLoadPhotosDoneAction>(
  CREATE_BOARD_LOAD_PHOTOS_DONE,
);

export const preloadCreateBoardData = (): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(preloadCreateBoardDataInit());

    try {
      dispatch(
        preloadCreateBoardDataDone({
          photos: await preloadPhotos(),
          isLoadingPhotos: false,
        }),
      );
    } catch (err) {
      dispatch(
        preloadCreateBoardDataDone({ photos: [], isLoadingPhotos: false }),
      );
    }

    try {
      await preloadPermissions(getMyTeams(getState()), dispatch, getState);

      dispatch(
        preloadCreateBoardDataDone({
          isLoadingVizPermissions: false,
        }),
      );
    } catch (err) {
      dispatch(
        preloadCreateBoardDataDone({
          isLoadingVizPermissions: false,
        }),
      );
    }
  };
};

export const loadPhotos = (query: string): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(loadMorePhotosInit({ query }));
    const { board } = getState().ui.createMenu;

    try {
      const photos = await loadMorePhotos(query, board.currentPhotosPage + 1);
      const hasMorePhotos = photos.length === PAGE_SIZE;
      dispatch(
        loadMorePhotosDone({
          photos,
          hasMorePhotos,
          hasLoadingError: false,
        }),
      );
    } catch (err) {
      dispatch(
        loadMorePhotosDone({
          photos: [],
          hasMorePhotos: false,
          hasLoadingError: true,
        }),
      );
    }
  };
};

export const createBoardSelectVisibility = actionCreator<CreateBoardSelectVisibilityAction>(
  CREATE_BOARD_SELECT_VISIBILITY,
);

const createBoardSubmitInit = actionCreator<CreateBoardSubmitInitAction>(
  CREATE_BOARD_SUBMIT_INIT,
);

const createBoardSubmitDone = actionCreator<CreateBoardSubmitDoneAction>(
  CREATE_BOARD_SUBMIT_DONE,
);

export const createBoardSubmit = (
  trackingOpts?: TrackingOptions,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(createBoardSubmitInit());

    const traceId = Analytics.startTask({
      taskName: 'create-board',
      source: 'appHeader',
    });

    try {
      const { name, photos } = getCreateBoardMenu(getState());

      const selectedTeam = getCreateBoardSelectedTeam(getState());
      const selectedTeamId =
        selectedTeam && selectedTeam.model && selectedTeam.model.id;

      const selectedVisibility = getCreateBoardSelectedVisibility(getState());

      if (!selectedVisibility) {
        throw new Error('No permission selected');
      }

      const state = getState();
      const background = getCreateBoardMenuBackgroundItemSelected(state);

      if (!background.id) {
        throw new Error('No background selected');
      }

      const ownedBoards: BoardModel[] = getMyOwnedBoards(state);
      const isFirstBoard =
        // Has no boards
        ownedBoards.length === 0 ||
        // Only has welcome board
        (ownedBoards.length === 1 &&
          isWelcomeBoard(getState(), ownedBoards[0]));
      const createDefaultLists = !!isFirstBoard;

      const requestData: {
        name: string;
        defaultLists: boolean;
        idOrganization?: string;
        prefs_background_url?: string;
        prefs_background?: string;
        prefs_permissionLevel: BoardPermissionLevel;
        prefs_selfJoin?: boolean;
      } = {
        defaultLists: createDefaultLists,
        name,
        prefs_permissionLevel: selectedVisibility,
        prefs_selfJoin:
          !!selectedTeamId && selectedVisibility !== AccessLevel.Private,
      };

      if (selectedTeamId) {
        requestData.idOrganization = selectedTeamId;
      }

      if (background.type === BackgroundType.Unsplash) {
        const photo = photos.find(({ id }) => id === background.id);

        if (photo) {
          requestData.prefs_background_url = unsplashClient.appendImageParameters(
            photo.urls.raw,
          );
          unsplashClient.trackDownload(photo);
        }
      } else if (
        background.type === BackgroundType.Color ||
        background.type === BackgroundType.Gradient
      ) {
        requestData.prefs_background = background.id;
      }

      const createdBoard = await api
        .withTracing(traceId, { task: 'create-board' })
        .rest.post<BoardResponse>('boards', {
          body: requestData,
        });

      dispatch(createBoardSubmitDone(createdBoard));

      Analytics.sendCreatedBoardEvent({
        source: getScreenFromUrl(),
        containers: {
          board: {
            id: createdBoard.id,
          },
          organization: {
            id: createdBoard.idOrganization,
          },
        },
        attributes: {
          visibility: createdBoard.prefs?.permissionLevel,
          isTemplate: createdBoard.prefs?.isTemplate,
          isBCFeature: true,
          requiredBC: false,
          taskId: traceId,
          method: trackingOpts && trackingOpts.method,
        },
      });

      Analytics.taskSucceeded({
        taskName: 'create-board',
        traceId,
        source: 'appHeader',
      });

      if (createdBoard.url) {
        const params = new URLSearchParams();
        if (createDefaultLists) {
          params.append('openCardComposerInFirstList', 'true');
        } else {
          params.append('openListComposer', 'true');
        }
        const url = new URL(createdBoard.url);

        navigate(`${url.pathname}?${params.toString()}`, {
          trigger: true,
        });
      }
      dispatch(removeOverlay());
    } catch (e) {
      Analytics.taskFailed({
        taskName: 'create-board',
        traceId,
        source: 'appHeader',
        error: e,
      });
      dispatch(createBoardSubmitDone());
    }
  };
};

export const createBoardFromTemplateSubmit = (
  templateId: string,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(createBoardSubmitInit());

    const traceId = Analytics.startTask({
      taskName: 'create-board/template',
      source: 'useTemplateInlineDialog',
    });

    try {
      const { name, keepFromSource } = getCreateBoardMenu(getState());

      const selectedTeam = getCreateBoardSelectedTeam(getState());
      const selectedTeamId =
        selectedTeam && selectedTeam.model && selectedTeam.model.id;

      const selectedVisibility = getCreateBoardSelectedVisibility(getState());

      if (!selectedVisibility) {
        throw new Error('No permission selected');
      }

      const keepFromSourceRequestData = [...keepFromSource, 'templates'];

      const requestData: {
        name: string;
        idOrganization?: string;
        prefs_permissionLevel: BoardPermissionLevel;
        prefs_isTemplate: boolean;
        idBoardSource: string;
        keepFromSource: string;
      } = {
        name,
        prefs_permissionLevel: selectedVisibility,
        prefs_isTemplate: false,
        idBoardSource: templateId,
        keepFromSource: keepFromSourceRequestData.join(),
      };

      if (selectedTeamId) {
        requestData.idOrganization = selectedTeamId;
      }
      const createdBoard = await api
        .withTracing(traceId, { task: 'create-board/template' })
        .rest.post<BoardResponse>('boards', {
          body: requestData,
        });

      dispatch(createBoardSubmitDone(createdBoard));

      Analytics.sendCreatedBoardEvent({
        source: 'useTemplateInlineDialog',
        containers: {
          board: {
            id: createdBoard.id,
          },
          organization: {
            id: createdBoard.idOrganization || '',
          },
        },
        attributes: {
          visibility: createdBoard.prefs?.permissionLevel ?? '',
          isBCFeature: true,
          requiredBC: false,
          isTemplate: true,
          taskId: traceId,
        },
      });

      Analytics.taskSucceeded({
        taskName: 'create-board/template',
        traceId,
        source: 'useTemplateInlineDialog',
      });

      if (createdBoard.url) {
        const params = new URLSearchParams();
        params.append('openListComposer', 'true');
        const url = new URL(createdBoard.url);

        navigate(`${url.pathname}?${params.toString()}`, {
          trigger: true,
        });
      }
    } catch (e) {
      Analytics.taskFailed({
        taskName: 'create-board/template',
        traceId,
        source: 'useTemplateInlineDialog',
        error: e,
      });
      dispatch(createBoardSubmitDone());
    }
  };
};

export const preSelectTeam = (
  preSelectedTeamId?: string,
): StandardThunkAction => async (dispatch: Dispatch, getState: () => State) => {
  const state: State = getState();
  if (preSelectedTeamId && getCreateBoardTeamById(state, preSelectedTeamId)) {
    dispatch(createBoardSelectTeam(preSelectedTeamId));
    return;
  }
  const bestTeam = getTeamByOrgRoute(state) || getCreateBoardBestTeam(state);
  if (bestTeam) {
    dispatch(createBoardSelectTeam(bestTeam.model.id));
  }
};
