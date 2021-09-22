import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import itemSearch from './modules/itemSearch';
import sharedState from './modules/sharedState';
import recentItems from './modules/recentItems';

export default function getStore() {
	const reducer = combineReducers({ itemSearch, sharedState, recentItems });

	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?.({ name: 'search-fe' }) || compose;

	const middleware = composeEnhancers(applyMiddleware(thunk));

	const store = createStore(reducer, middleware);

	return store;
}
