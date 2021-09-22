import { combineReducers } from 'redux';
import actionPopovers from './actionPopovers';
import dragging from './dragging';
import deals from './deals';
import goals from '../components/Goals/reducers';
import filters from './filters';
import pipelines from './pipelines';
import selectedFilter from './selectedFilter';
import selectedPipelineId from './selectedPipeline';
import summary from './summary';
import view from './view';
import snackbar from '../components/SnackbarMessage/reducer';
import edit from './edit';

export default combineReducers({
	actionPopovers,
	deals,
	goals,
	dragging,
	filters,
	pipelines,
	selectedFilter,
	selectedPipelineId,
	summary,
	view,
	snackbar,
	edit,
});
