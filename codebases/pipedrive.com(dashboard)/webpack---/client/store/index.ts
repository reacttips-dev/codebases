import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { getLoggerMiddleware, getPdMetricsMiddleware } from '@pipedrive/react-utils';
import thunk from 'redux-thunk';
import reducers from '../reducers';

export let store: Store;

const configureStore = function (initialState = {}, webappAPI: Webapp.API): Store {
	const composeEnhancers = composeWithDevTools({ name: `Pipeline view - ${document.title}` });
	const middlewares = [
		thunk,
		getLoggerMiddleware(webappAPI.logger, 'pipeline-view'),
		getPdMetricsMiddleware(webappAPI.pdMetrics, 'pipeline-view'),
	];

	// @ts-expect-error Fix needed for type definitions `@pipedrive/react-utils/middlewares/logger`
	store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(...middlewares)));

	return store;
};

export default configureStore;
