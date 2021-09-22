import React, { createContext, useReducer, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import reducers from './reducers';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
	const initialState = useMemo(() => reducers({}, { type: '__INIT__' }), []);
	const [state, dispatch] = useReducer(reducers, initialState);

	return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

StoreProvider.propTypes = { children: PropTypes.node };

export default (mapDispatch = {}) => {
	const { state, dispatch } = useContext(StoreContext);

	const newDispatch = (action) => {
		if (typeof action === 'function') {
			return action(newDispatch, state);
		}

		return dispatch(action);
	};
	const actions = {};

	Object.keys(mapDispatch).forEach((key) => {
		actions[key] = (...args) => {
			return newDispatch(mapDispatch[key](...args));
		};
	});

	return { state, actions };
};
