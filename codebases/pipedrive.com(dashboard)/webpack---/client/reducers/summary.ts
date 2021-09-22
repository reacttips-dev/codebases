import { combineReducers } from 'redux';
import { SetSummariesAction, SummaryActionTypes } from '../actions/summary';

function deals(state = {}, action: SetSummariesAction) {
	if (action.type === SummaryActionTypes.SET_SUMMARIES && action.payload.dealsTotalSummary) {
		return action.payload.dealsTotalSummary;
	}

	return state;
}

function byStages(state = {}, action: SetSummariesAction) {
	if (action.type === SummaryActionTypes.SET_SUMMARIES && action.payload.dealsByStagesSummary) {
		return action.payload.dealsByStagesSummary.per_stages || {};
	}

	return state;
}

function byStagesConverted(state = {}, action: SetSummariesAction) {
	if (action.type === SummaryActionTypes.SET_SUMMARIES && action.payload.dealsByStagesSummary) {
		return action.payload.dealsByStagesSummary.per_stages_converted || {};
	}

	return state;
}

export default combineReducers({
	deals,
	byStages,
	byStagesConverted,
});
