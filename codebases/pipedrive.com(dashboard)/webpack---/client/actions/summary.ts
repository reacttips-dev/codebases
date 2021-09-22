import { debounce } from 'lodash';
import { Action, bindActionCreators } from 'redux';
import { getByStagesSummary, getDealsSummary } from '../api';
import { getViewerSummary } from '../api/viewer';
import { isInsightsEnabled } from '../shared/api/webapp';
import { fetchGoals, fetchStats } from '../components/Goals/actions';
import { getSelectedFilter } from '../selectors/filters';
import { getSelectedPipelineId } from '../selectors/pipelines';
import { wait } from '../utils/wait';
import { ThunkAction } from 'redux-thunk';
import { getSelectedLink } from '../selectors/links';

export enum SummaryActionTypes {
	SET_SUMMARIES = 'SET_SUMMARIES',
	SET_SUMMARIES_FAILURE = 'SET_SUMMARIES_FAILURE',
}

export interface SetSummariesAction extends Action<SummaryActionTypes.SET_SUMMARIES> {
	payload: {
		dealsTotalSummary?: Pipedrive.DealsSummaryData;
		dealsByStagesSummary?: Pipedrive.DealsByStagesSummary;
	};
}

type FetchAllStatistics = ThunkAction<void, PipelineState, null, SetSummariesAction>;

type AllStatisticsParams = {
	includeGoals: boolean;
};

type FetchAllStatisticsParameters = Parameters<FetchAllStatistics>;

type AllStatisticsThunkParams = AllStatisticsParams & {
	dispatch: FetchAllStatisticsParameters[0];
	getState: FetchAllStatisticsParameters[1];
};

const getAllStatisticsThunk = async ({ dispatch, getState, includeGoals }: AllStatisticsThunkParams) => {
	const actions = bindActionCreators({ fetchGoals, fetchStats }, dispatch);
	const state = getState();
	const selectedPipelineId = getSelectedPipelineId(state);
	const selectedFilter = getSelectedFilter(state);

	const dealsByStagesSummary = await getByStagesSummary(selectedPipelineId, selectedFilter);
	const dealsTotalSummary = await getDealsSummary(selectedPipelineId, selectedFilter);

	dispatch({
		type: SummaryActionTypes.SET_SUMMARIES,
		payload: {
			dealsByStagesSummary,
			dealsTotalSummary,
		},
	});

	if (isInsightsEnabled()) {
		if (includeGoals) {
			actions.fetchGoals();
		} else {
			// Let's wait and hope `statistics-api` is updated within 5 seconds ¯\_(ツ)_/¯
			await wait(5000);
			actions.fetchStats();
		}
	}
};

const innerDebounceForFetchAllStatistics = debounce(getAllStatisticsThunk, 2000);

export const debouncedFetchAllStatistics =
	(params: AllStatisticsParams): FetchAllStatistics =>
	(dispatch, getState) =>
		innerDebounceForFetchAllStatistics({ dispatch, getState, ...params });

export const fetchAllStatistics =
	(params: AllStatisticsParams): FetchAllStatistics =>
	async (dispatch, getState) =>
		getAllStatisticsThunk({ dispatch, getState, ...params });

export interface SetViewerSummariesAction extends Action<SummaryActionTypes.SET_SUMMARIES> {
	payload: {
		dealsTotalSummary?: {
			total_count: number;
			total_currency_converted_value: number;
		};
		dealsByStagesSummary?: {
			per_stages_converted: Viewer.PerStagesConverted;
		};
	};
}

export type SetSummariesFailure = Action<SummaryActionTypes.SET_SUMMARIES_FAILURE>;

export const fetchViewerSummary =
	(): ThunkAction<void, Viewer.State, null, SetViewerSummariesAction | SetSummariesFailure> =>
	async (dispatch, getState) => {
		const state = getState();
		const linkId = getSelectedLink(state).hash;

		try {
			const { per_stages_converted, total_count, total_value } = await getViewerSummary(linkId);
			dispatch({
				type: SummaryActionTypes.SET_SUMMARIES,
				payload: {
					dealsByStagesSummary: {
						per_stages_converted,
					},
					dealsTotalSummary: {
						total_count,
						total_currency_converted_value: total_value,
					},
				},
			});
		} catch (error) {
			dispatch({
				type: SummaryActionTypes.SET_SUMMARIES_FAILURE,
				error,
			});
		}
	};
