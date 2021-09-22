import { createStore, compose, applyMiddleware, Store } from 'redux';
import { getLoggerMiddleware, getPdMetricsMiddleware } from '@pipedrive/react-utils';
import thunk from 'redux-thunk';
import reducers from '../reducers';

export let store: Store;

const configureStore = function (initialState = {}, webappAPI: Webapp.API): Store<any> {
	const middlewares = [
		thunk,
		getLoggerMiddleware(webappAPI.logger, 'forecast-view'),
		getPdMetricsMiddleware(webappAPI.pdMetrics, 'forecast-view'),
	];

	store = createStore(
		reducers,
		initialState,
		compose(
			// @ts-expect-error Fix needed for type definitions `@pipedrive/react-utils/middlewares/logger`
			applyMiddleware(...middlewares),
			(window as any).devToolsExtension
				? (window as any).devToolsExtension({
						name: `Forecast view - ${document.title}`,
				  })
				: (f: any) => f,
		),
	);

	return store;
};

export default configureStore;
