import { LOCATION_CHANGE, replace } from 'react-router-redux';

import { asyncRedirectTo } from 'actions/redirect';
import { isCurrentPageUrlTest } from 'helpers/LandingPageUtils';
import { getInfoForUrlTest } from 'helpers/HydraHelpers';
import { triggerAssignment } from 'actions/ab';

/*
  If the page recieving navigation has an active URL test, trigger test assignment and handle the redirect appropriately
  This middleware depends on both redux-thunk and react-router-redux middleware to work, so ensure this middleware is placed
  BEFORE those are running (so they can intercept the actions)
*/

const urlTestMiddleware = store => next => (action = {}) => {
  if (action.type === LOCATION_CHANGE) {
    const appState = store.getState();
    const { ab: { urlTests } = {} } = appState;
    const route = action.payload?.pathname;
    const currentTest = isCurrentPageUrlTest(route, urlTests);
    if (currentTest) {
      const { name } = currentTest;
      const { index: assignmentGroup } = store.dispatch(triggerAssignment(name));
      const { url } = currentTest.variants?.[assignmentGroup];
      const { pathName } = getInfoForUrlTest(url);

      // For client-side routes, we need to ensure this redirect is placed AFTER the regular react-router state change
      // Server-side, we can just let RRR handle the replacement
      switch (action.payload.action) {
        case 'PUSH':
          store.dispatch(asyncRedirectTo(pathName));
          break;
        case 'POP':
          store.dispatch(replace(pathName));
          break;
      }
    }
  }
  return next(action);
};

export default urlTestMiddleware;
