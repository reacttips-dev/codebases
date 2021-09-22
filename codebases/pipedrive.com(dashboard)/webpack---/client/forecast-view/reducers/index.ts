import { combineReducers } from 'redux';
import actionPopovers from '../../reducers/actionPopovers';
import deals from './deals';
import unlistedDealsList from './unlistedDealsList';
import filters from '../../reducers/filters';
import pipelines from '../../reducers/pipelines';
import selectedFilter from '../../reducers/selectedFilter';
import selectedPipelineId from '../../reducers/selectedPipeline';
import dragging from '../../reducers/dragging';
import view from '../../reducers/view';
import settings from './settings';
import periodStartDate from './periodStartDate';

export default combineReducers({
	actionPopovers,
	deals,
	unlistedDealsList,
	filters,
	pipelines,
	selectedFilter,
	selectedPipelineId,
	periodStartDate,
	settings,
	view,
	dragging,
});
