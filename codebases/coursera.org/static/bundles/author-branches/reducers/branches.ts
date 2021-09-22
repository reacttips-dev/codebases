import _ from 'lodash';
import { storeNames } from 'bundles/author-branches/constants';
import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';

type Action = {
  type: string;
  loadingAll: boolean;
  loadedAll: boolean;
  branches: Array<{ [branchId: string]: AuthoringCourseBranch }>;
  branchId: string;
  drafts: { [draftId: string]: string };
  branch: AuthoringCourseBranch;
};

const initialState = { branches: {}, drafts: {} };
/**
 * versions reducer
 * @param  {object}  state
 * @param  {object}  action
 * @param  {string}  action.type - Decides what handler
 * @param  {boolean} action.loadingAll - in process of loading
 * @param  {boolean} action.loadedAll - loaded all
 * @param  {object}  action.branches - map of branchIds to course branch info objects
 * @return {object}  new state of the store
 */
function branches(incomingState = initialState, action: Action) {
  const state = Object.assign({}, incomingState);

  switch (action.type) {
    case 'ON_BRANCHES_LOADING':
      return {
        ...state,
        loadingAll: true,
        loadedAll: false,
      };
    case 'ON_BRANCHES_LOAD_SUCCESS':
      return {
        ...state,
        loadingAll: false,
        loadedAll: true,
        branches: _.keyBy(action.branches, 'id'),
      };
    case 'SAVE_BRANCH':
      return {
        ...state,
        branches: Object.assign({}, state.branches, {
          [action.branchId]: Object.assign({}, action.branch, {
            id: action.branchId,
          }),
        }),
      };
    case 'SAVE_DRAFTS_FOR_BRANCH':
      return {
        ...state,
        drafts: Object.assign({}, state.drafts, {
          [action.branchId]: action.drafts,
        }),
      };
    case 'SAVE_CONFLICT_METADATA_FOR_BRANCH':
    case 'VALIDATE_BRANCH':
    case 'ON_BRANCH_CREATING':
    case 'ON_BRANCH_UPDATE_SUCCESS':
    case 'ON_BRANCH_UPDATE_FAILURE':
    case 'ON_BRANCH_DELETING':
    case 'ON_BRANCH_DELETE_SUCCESS':
    default:
      return state;
  }
}

export const store = createStoreFromReducer<{ branches: {}; drafts: {} }, Action>(
  branches,
  storeNames.BRANCHES_STORE,
  [
    'ON_BRANCHES_LOADING',
    'ON_BRANCHES_LOAD_SUCCESS',
    'ON_BRANCH_CREATING',
    'ON_BRANCH_UPDATE_SUCCESS',
    'ON_BRANCH_UPDATE_FAILURE',
    'SAVE_BRANCH',
    'ON_BRANCH_DELETING',
    'ON_BRANCH_DELETE_SUCCESS',
    'SAVE_CONFLICT_METADATA_FOR_BRANCH',
    'SAVE_DRAFTS_FOR_BRANCH',
  ],
  initialState
);

export const reducer = branches;
