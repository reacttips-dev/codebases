import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers, compose, createStore } from 'redux';

import navigationReducer from './navigation/reducers';

const rootReducer = combineReducers({
	navigation: navigationReducer,
});

const devtoolEnhancer = (window as Window).__REDUX_DEVTOOLS_EXTENSION__
	? window.__REDUX_DEVTOOLS_EXTENSION__({
			name: 'froot-state',
	  })
	: (f) => f;

export function configureStore(initialState) {
	return createStore(rootReducer, initialState, compose(devtoolEnhancer));
}

export type RootState = ReturnType<typeof rootReducer>;

export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;
