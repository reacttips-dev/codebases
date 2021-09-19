import { combineReducers, Reducer } from 'redux';
import reduceReducers from 'reduce-reducers';

import { LOAD_INITIAL_LOCAL_STORAGE } from 'constants/reduxActions';
import onDemandSize from 'reducers/onDemandSize';
import lastSelectedSizes from 'reducers/lastSelectedSizes';
import { AppAction } from 'types/app';

const localStorageReducers = combineReducers({
  lastSelectedSizes,
  onDemandSize
});

interface LocalStorageState {
  [key: string]: any;
}

function rootLocalStorageReducer(state: Readonly<LocalStorageState> = {}, action: AppAction): LocalStorageState {
  switch (action.type) {
    case LOAD_INITIAL_LOCAL_STORAGE:
      return {
        ...state,
        ...action.initialLocalStorage
      };
    default:
      return state;
  }
}

export default reduceReducers(localStorageReducers, rootLocalStorageReducer as Reducer<any, any>);
