import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { isFunction } from 'lodash';

const getErrorContext = () => ({
	url: document.location.toString(),
	...(navigator && navigator.language ? { language: navigator.language } : {}),
	...(navigator && navigator.platform ? { platform: navigator.platform } : {}),
	...(navigator && navigator.userAgent ? { user_agent: navigator.userAgent } : {}),
});

const getStateFromStore = (store) => {
	const state = store.getState();

	return state.toJS ? state.toJS() : state;
};

const extractErrorMessage = (error) => {
	if (!error) {
		return 'Unknown error';
	}

	if (error.message) {
		return error.message;
	}

	if (typeof error.json === 'function') {
		// fetch library unwrapped errors
		return `Fetch error: ${error.status}; text: ${error.statusText}.`;
	}

	return `${error}`;
};

const reportError = async ({ error, logErrorRemotely, apiLogger, store }) => {
	try {
		const res = await error.json();

		error.message = `${
			error.message ||
			`Fetch error: ${error.status || res?.statusCode}; text: ${res?.errorMessageExtra}: ${
				res?.error
			}`
		}.`;

		error.stack = error.stack || res?.errorStack;
	} catch (err) {
		error.message = `Fetch error: ${error.status}; text: ${err}.`;
	}

	logErrorRemotely(error, apiLogger.logStateOnError ? getStateFromStore(store) : null);

	throw error;
};

const crashReporter = (apiLogger) => {
	const logErrorRemotely = (error, state) => {
		const errorMessage = extractErrorMessage(error);
		const stack = error && error.stack;
		const extra = error && error.extra;

		apiLogger.remote(
			'error',
			errorMessage,
			{
				errorMessage,
				stack,
				...(extra ? extra : {}),
				...getErrorContext(),
				...(state ? { state } : {}),
			},
			apiLogger.facility,
		);
	};

	return (store) => (following) => (action) => {
		try {
			const result = following(action);

			if (result && isFunction(result.catch)) {
				result.catch((error) => reportError({ error, logErrorRemotely, apiLogger, store }));
			}

			return result;
		} catch (err) {
			logErrorRemotely(err, apiLogger.logStateOnError ? getStateFromStore(store) : null);

			throw err;
		}
	};
};

export default function composeMiddleware(apiLogger, extraArgument, ...extraMiddleware) {
	let thunkObject = thunk;

	if (extraArgument) {
		thunkObject = thunkObject.withExtraArgument(extraArgument);
	}

	const middlewares = apiLogger ? [crashReporter(apiLogger), thunkObject] : [thunkObject];

	if (process.env.NODE_ENV === 'development') {
		const reduxLogger = require('redux-logger');
		const logger = reduxLogger.createLogger({
			collapsed: true,
			stateTransformer: (state) => state.toJS(),
		});

		// require in place to omit production bundle
		middlewares.push(logger);
	}

	return applyMiddleware(...[...middlewares, ...extraMiddleware]);
}
