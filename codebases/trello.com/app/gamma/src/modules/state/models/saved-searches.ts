/* eslint-disable import/no-default-export */
import API from 'app/gamma/src/api';
import { normalizeSavedSearch } from 'app/gamma/src/api/normalizers/saved-search';
import { Analytics } from '@trello/atlassian-analytics';
import {
  LOAD_HEADER_SUCCESS,
  LoadHeaderSuccessAction,
} from 'app/gamma/src/modules/loaders/load-header';
import {
  getSavedSearchById,
  getSavedSearches,
} from 'app/gamma/src/selectors/saved-searches';
import { getMyId } from 'app/gamma/src/selectors/session';
import { SavedSearchResponse } from 'app/gamma/src/types/responses';
import { SavedSearchModel } from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator, createReducer } from '@trello/redux';
import { calculatePos } from 'app/gamma/src/util/position';
import {
  SOCKET_MEMBER,
  SocketMemberAction,
  isDeletedModel,
} from 'app/gamma/src/modules/sockets';
import { State } from 'app/gamma/src/modules/types';

export interface SavedSearchUpdate {
  id: string;
  position: number;
}

export interface SavedSearchState {
  [savedSearchId: string]: SavedSearchModel;
}

const ADD_SAVED_SEARCH_SUCCESS = Symbol('ADD_SAVED_SEARCH_SUCCESS');
const ADD_SAVED_SEARCH_FAILURE = Symbol('ADD_SAVED_SEARCH_FAILURE');

const REMOVE_SAVED_SEARCH_SUCCESS = Symbol('REMOVE_SAVED_SEARCH_SUCCESS');
const REMOVE_SAVED_SEARCH_FAILURE = Symbol('REMOVE_SAVED_SEARCH_FAILURE');

const UPDATE_POS_REQUEST = Symbol('UPDATE_POS_REQUEST');
const UPDATE_POS_SUCCESS = Symbol('UPDATE_POS_SUCCESS');
const UPDATE_POS_ERROR = Symbol('UPDATE_POS_ERROR');

type AddSavedSearchAction = Action<
  typeof ADD_SAVED_SEARCH_SUCCESS,
  SavedSearchResponse
>;

type RemoveSavedSearchAction = Action<
  typeof REMOVE_SAVED_SEARCH_SUCCESS,
  { id: string }
>;

type UpdatePosRequestAction = Action<
  typeof UPDATE_POS_REQUEST,
  SavedSearchResponse
>;

type UpdatePosSuccessAction = Action<
  typeof UPDATE_POS_SUCCESS,
  SavedSearchResponse
>;

type UpdatePosErrorAction = Action<typeof UPDATE_POS_ERROR, SavedSearchModel>;

// Actions Creators
export const addSavedSearchAction = actionCreator<AddSavedSearchAction>(
  ADD_SAVED_SEARCH_SUCCESS,
);

export const removeSavedSearchAction = actionCreator<RemoveSavedSearchAction>(
  REMOVE_SAVED_SEARCH_SUCCESS,
);

export const savedSearchPosUpdateActionStart = actionCreator<UpdatePosRequestAction>(
  UPDATE_POS_REQUEST,
);

export const savedSearchPosUpdateActionSuccess = actionCreator<UpdatePosSuccessAction>(
  UPDATE_POS_SUCCESS,
);

export const savedSearchPosUpdateActionError = actionCreator<UpdatePosErrorAction>(
  UPDATE_POS_ERROR,
);

//Helper
const upsertSavedSearch = (
  state: SavedSearchState,
  savedSearch: SavedSearchResponse,
) => ({
  ...state,
  [savedSearch.id]: {
    ...(state[savedSearch.id] || {}),
    ...normalizeSavedSearch(savedSearch),
  },
});

//Actions
export const addSavedSearch = (
  savedSearch: SavedSearchModel,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const state = getState();
      const idMember = getMyId(state);

      const returnedSavedSearch = await API.client.rest.post<SavedSearchResponse>(
        `/member/${idMember}/savedSearches`,
        {
          body: savedSearch,
        },
      );

      dispatch(addSavedSearchAction(returnedSavedSearch));
      Analytics.sendUIEvent({
        action: 'saved',
        actionSubject: 'search',
        source: 'searchInlineDialog',
      });
    } catch (err) {
      dispatch(actionCreator(ADD_SAVED_SEARCH_FAILURE)(err));
    }
  };
};

export const removeSavedSearch = (id: string): StandardThunkAction<void> => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const state = getState();
      const idMember = getMyId(state);

      await API.client.rest.del(`members/${idMember}/savedSearches/${id}`);

      dispatch(removeSavedSearchAction({ id }));

      Analytics.sendUIEvent({
        action: 'deleted',
        actionSubject: 'search',
        source: 'searchInlineDialog',
        attributes: {
          searchId: id,
        },
      });
    } catch (err) {
      dispatch(actionCreator(REMOVE_SAVED_SEARCH_FAILURE)(err));
    }
  };
};

export const updateSavedSearchPosition = ({
  id,
  position,
}: SavedSearchUpdate): StandardThunkAction<void> => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const idMember = getMyId(state);
    const savedSearch = getSavedSearchById(state, id);

    if (savedSearch) {
      try {
        const savedSearches = getSavedSearches(state);
        const newPos = calculatePos(position, savedSearches, savedSearch);

        dispatch(
          savedSearchPosUpdateActionStart({ ...savedSearch, pos: newPos }),
        );

        const savedSearchReponse = await API.client.rest.put<SavedSearchModel>(
          `members/${idMember}/savedSearches/${id}`,
          {
            body: {
              pos: newPos,
            },
          },
        );

        dispatch(savedSearchPosUpdateActionSuccess(savedSearchReponse));
      } catch (err) {
        dispatch(savedSearchPosUpdateActionError(savedSearch));
      }
    }
  };
};

const normalizeSavedSearchesArray = (
  savedSearches: SavedSearchResponse[],
  state: SavedSearchState,
) =>
  savedSearches.reduce(
    (result, search) => upsertSavedSearch(result, search),
    state,
  );

// Reducer
const initialState: SavedSearchState = {};

export default createReducer(initialState, {
  [LOAD_HEADER_SUCCESS](state, { payload }: LoadHeaderSuccessAction) {
    const { savedSearches = [] } = payload;

    return normalizeSavedSearchesArray(savedSearches, state);
  },
  [ADD_SAVED_SEARCH_SUCCESS](state, { payload }: AddSavedSearchAction) {
    return upsertSavedSearch(state, payload);
  },
  [ADD_SAVED_SEARCH_FAILURE](state, { message }: Error) {
    // TODO: handle this failure

    return state;
  },
  [REMOVE_SAVED_SEARCH_SUCCESS](state, { payload }: RemoveSavedSearchAction) {
    const { [payload.id]: removed, ...rest } = state;

    return rest;
  },
  [REMOVE_SAVED_SEARCH_FAILURE](state, { message }: Error) {
    // TODO: handle this failure

    return state;
  },
  [UPDATE_POS_REQUEST](state, { payload }: UpdatePosRequestAction) {
    return upsertSavedSearch(state, payload);
  },
  [UPDATE_POS_SUCCESS](state, { payload }: UpdatePosSuccessAction) {
    return upsertSavedSearch(state, payload);
  },
  [UPDATE_POS_ERROR](state, { payload }: UpdatePosErrorAction) {
    return upsertSavedSearch(state, payload);
  },
  [SOCKET_MEMBER](state, { payload }: SocketMemberAction) {
    if (!isDeletedModel(payload) && payload.savedSearches) {
      return normalizeSavedSearchesArray(payload.savedSearches, initialState);
    }

    return state;
  },
});
