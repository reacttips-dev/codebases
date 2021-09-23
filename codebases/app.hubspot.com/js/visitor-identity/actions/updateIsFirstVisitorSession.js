'use es6';

import { createAction } from 'flux-actions';
import { UPDATE_IS_FIRST_VISITOR_SESSION } from '../constants/ActionTypes';
export var updateIsFirstVisitorSession = createAction(UPDATE_IS_FIRST_VISITOR_SESSION, function (isFirstVisitorSession) {
  return {
    isFirstVisitorSession: isFirstVisitorSession
  };
});