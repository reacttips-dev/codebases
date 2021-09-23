/**
 * This differs from the react server-side middleware and only applies to the client-side app
 */
import Cookies from 'js-cookie';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createCookieMiddleware } from 'redux-cookie';
import analytics from 'redux-analytics';
import { routerMiddleware } from 'react-router-redux';
import { trackReduxAction } from './modules/analytics';

export default function applyMiddlewareWithHistory(history) {
  // reduxRouterMiddleware lets your app dispatch actions that will change URL
  const reduxRouterMiddleware = routerMiddleware(history);
  // import track from 'my-awesome-analytics-library';
  const analyticsMiddleware = analytics(trackReduxAction);
  return applyMiddleware(
    reduxRouterMiddleware,
    thunk,
    createCookieMiddleware(Cookies),
    analyticsMiddleware
  );
}
