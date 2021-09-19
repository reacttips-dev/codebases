import {
  SET_ASK_HMD_SURVEY_DATA
} from 'constants/reduxActions';
import { AppAction } from 'types/app';

export interface HmdState {
  content?: string;
  key?: string;
}

export default function hmdSurvey(state: HmdState = {}, action: AppAction): HmdState {

  switch (action.type) {
    case SET_ASK_HMD_SURVEY_DATA:
      return action.data;

    default:
      return state;
  }
}
