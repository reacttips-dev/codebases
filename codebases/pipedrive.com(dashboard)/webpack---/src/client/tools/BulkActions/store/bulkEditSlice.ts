import { post } from '@pipedrive/fetch';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

import { ActionType, BulkEditOptions, Criteria, EntityType, ResponseType } from '../types';

type PostState = 'idle' | 'pending' | 'succeeded' | 'failed';

interface OpenPayload {
	entityType: EntityType;
	totalCount: number;
	visibleCount: number;
	criteria: Criteria;
	canBulkDelete?: boolean;
}

export interface ViewState {
	action: ActionType;
	showProgressbar: boolean;
	showSidebar: boolean;
	sidebarMounted: boolean;
	showConfirmationDialog: boolean;
	submitStatus: PostState;
	options: BulkEditOptions;
	criteria: Criteria;
	canBulkDelete: boolean;
	apiData: ResponseType;
	entityType: EntityType;
	selectedItemsCount: number;
	visibleCount: number;
}

const initialState: ViewState = {
	action: null,
	showProgressbar: false,
	showSidebar: false,
	sidebarMounted: false,
	showConfirmationDialog: false,
	submitStatus: 'idle',
	criteria: null,
	canBulkDelete: false,
	options: null,
	apiData: {},
	entityType: null,
	selectedItemsCount: 0,
	visibleCount: 0,
};

function getSelectedItemsCount(collection: Criteria, totalCount: number) {
	const { bulkEditFilter, selectedIds = [], excludedIds = [] } = collection;

	return bulkEditFilter ? totalCount - excludedIds?.length : selectedIds?.length;
}

export const postBulkAction = createAsyncThunk('bulkEdit/postBulkAction', (data: any, { getState }) => {
	const { entityType, criteria, action } = getState() as RootState;

	const { selectedIds, excludedIds, bulkEditFilter } = criteria;

	const params: any = {
		item: entityType,
		action: action === 'edit' ? 'update' : 'delete',
		criteria: {
			ids: selectedIds,
			exclude_ids: excludedIds,
			...(bulkEditFilter || {}),
		},
	};

	if (data) {
		params.edit_data = data;
	}

	return post<ResponseType>('/api/v1/bulk-actions/action', params);
});

const bulkEditSlice = createSlice({
	name: 'bulkEdit',
	initialState,
	reducers: {
		openSidebar(state, action: PayloadAction<OpenPayload>) {
			state.showSidebar = true;
			state.sidebarMounted = true;

			const { entityType, canBulkDelete, criteria: collection, totalCount } = action.payload;

			state.criteria = collection;
			state.canBulkDelete = canBulkDelete;
			state.entityType = entityType;
			state.selectedItemsCount = getSelectedItemsCount(collection, totalCount);
		},
		closeSidebar(state) {
			state.showSidebar = false;
		},
		afterCloseSidebar(state) {
			state.sidebarMounted = false;
		},
		clickDelete(state) {
			state.action = 'delete';
			state.showConfirmationDialog = true;
		},
		submitForm(state) {
			state.action = 'edit';
			state.showConfirmationDialog = true;
		},
		cancelDialog(state) {
			state.action = null;
			state.showConfirmationDialog = false;
		},
		closeProgressbar(state) {
			state.showProgressbar = false;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(postBulkAction.pending, (state) => {
			state.submitStatus = 'pending';

			state.showProgressbar = false;
		});

		builder.addCase(postBulkAction.rejected, (state) => {
			state.submitStatus = 'failed';

			state.showProgressbar = true;
		});

		builder.addCase(postBulkAction.fulfilled, (state, { payload }) => {
			state.submitStatus = 'succeeded';
			state.apiData = { ...(payload.data || {}), total_count: state.selectedItemsCount };

			state.showConfirmationDialog = false;
			state.showSidebar = false;
			state.showProgressbar = true;
		});
	},
});

export const {
	openSidebar,
	closeSidebar,
	clickDelete,
	submitForm,
	cancelDialog,
	closeProgressbar,
	afterCloseSidebar,
} = bulkEditSlice.actions;

export default bulkEditSlice.reducer;
