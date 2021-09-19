import { combineReducers } from 'redux';

import onDemandSizing from './onDemandSizing';

import {
  REQUEST_PRODUCT_DETAIL,
  SET_RECOMMENDED_FIT
} from 'constants/reduxActions';
import { AppAction } from 'types/app';

export interface SizingChooserState {
  recommendedFit: string;
}

const initialState = {
  recommendedFit: ''
};

export function sizingChooser(state: SizingChooserState = initialState, action: AppAction): SizingChooserState {
  switch (action.type) {
    case SET_RECOMMENDED_FIT:
      const { recommendedFit } = action;
      return { ...state, recommendedFit };
    case REQUEST_PRODUCT_DETAIL:
      return initialState;
    default:
      return state;
  }
}

export default combineReducers({
  sizingChooser,
  onDemandSizing
});

