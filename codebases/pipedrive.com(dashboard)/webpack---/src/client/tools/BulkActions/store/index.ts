import { configureStore } from '@reduxjs/toolkit';
import { createSelectorHook, useDispatch } from 'react-redux';

import bulkEditReducer from './bulkEditSlice';

export const store = configureStore({
	reducer: bulkEditReducer,
	devTools: {
		name: 'bulk-edit-state',
	},
});

export type RootState = ReturnType<typeof store.getState>;

export const useRootSelector = createSelectorHook<RootState>();

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
