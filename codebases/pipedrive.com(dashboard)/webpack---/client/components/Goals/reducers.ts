import { groupBy } from 'lodash';
import { combineReducers } from 'redux';
import { FilterActionTypes, SetSelectedFilterAction } from '../../actions/filters';
import { FetchGoalsSuccessAction, GoalsActions, GoalsActionTypes } from './actions';
import { SetGoalsWithStatisticsAction, StatisticsActions, StatisticsActionTypes } from './actions-statistics';

function isLoading(state = false, action: StatisticsActions | GoalsActions) {
	if (action.type === GoalsActionTypes.FETCH_GOALS_REQUEST) {
		return true;
	}

	if (
		action.type === StatisticsActionTypes.SET_GOALS_WITH_STATISTICS ||
		action.type === StatisticsActionTypes.FETCH_STATISTICS_FAILURE ||
		action.type === GoalsActionTypes.FETCH_GOALS_FAILURE
	) {
		return false;
	}

	return state;
}
function stagesWithGoals(state = {}, action: FetchGoalsSuccessAction | SetSelectedFilterAction) {
	if (action.type === GoalsActionTypes.FETCH_GOALS_SUCCESS) {
		return action.payload;
	}

	if (action.type === FilterActionTypes.SET_SELECTED_FILTER && action.payload.type === 'filter') {
		return {};
	}

	return state;
}

function byStagesWithStats(state = {}, action: SetGoalsWithStatisticsAction) {
	if (action.type === StatisticsActionTypes.SET_GOALS_WITH_STATISTICS) {
		return groupBy(action.payload, 'params.stage_id');
	}

	return state;
}

export default combineReducers({
	isLoading,
	stagesWithGoals,
	byStagesWithStats,
});
