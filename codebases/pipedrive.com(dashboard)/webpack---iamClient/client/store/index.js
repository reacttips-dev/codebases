import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware, routerReducer as router } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import Immutable from 'seamless-immutable';
import trackingMiddleware from 'middleware/tracking';
import loggerMiddleware from 'middleware/logger';
import routeMiddleware from 'middleware/route';
import fetchMiddleware from 'middleware/fetch';
import contextSupportRoutes from 'constants/contextualSupport/routes';
import gettingStartedRoutes from 'constants/gettingStarted/routes';
import support from 'reducers/contextualSupport';
import user from 'reducers/user';
import coachmarks from 'reducers/coachmarks';
import fullscreen from 'reducers/fullscreen';
import gettingStarted from 'reducers/gettingStarted';
import settings from 'reducers/settings';

const initialState = Immutable.from({});

export const contextualSupportHistory = createMemoryHistory({
	initialEntries: [contextSupportRoutes.INDEX],
});

export const gettingStartedHistory = createMemoryHistory({
	initialEntries: [gettingStartedRoutes.INDEX],
});

const contextualSupportRootReducer = combineReducers({
	support,
	user,
	router,
	fullscreen,
	settings,
});

export const contextualSupportStore = createStore(contextualSupportRootReducer, initialState, composeWithDevTools(
	applyMiddleware(
		routerMiddleware(contextualSupportHistory),
		thunk,
		loggerMiddleware,
		fetchMiddleware,
		trackingMiddleware,
		routeMiddleware,
	),
));

const gettingStartedRootReducer = combineReducers({
	user,
	router,
	fullscreen,
	gettingStarted,
	settings,
});

export const gettingStartedStore = createStore(gettingStartedRootReducer, initialState, composeWithDevTools(
	applyMiddleware(
		routerMiddleware(gettingStartedHistory),
		thunk,
		loggerMiddleware,
		fetchMiddleware,
		trackingMiddleware,
		routeMiddleware,
	),
));

const coachmarksRootReducer = combineReducers({
	user,
	coachmarks,
	settings,
});

export const coachmarksStore = createStore(coachmarksRootReducer, initialState, composeWithDevTools(
	applyMiddleware(
		thunk,
		loggerMiddleware,
		fetchMiddleware,
		trackingMiddleware,
	),
));
