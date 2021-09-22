import { differenceBy, omit } from 'lodash';
import { Action, bindActionCreators, Dispatch } from 'redux';
import * as api from '../../api';
import { getStages } from '../../shared/api/webapp';
import { getCurrentCompanyId } from '../../shared/api/webapp/index';
import { getSelectedFilter } from '../../selectors/filters';
import { getSelectedPipelineId } from '../../selectors/pipelines';
import { getEndOfNextPeriod, getStartOfNextPeriod } from '../../utils/getPeriods';
import { StatisticsActionTypes, StatisticsActions } from './actions-statistics';

export enum GoalsActionTypes {
	FETCH_GOALS_REQUEST = 'FETCH_GOALS_REQUEST',
	FETCH_GOALS_SUCCESS = 'FETCH_GOALS_SUCCESS',
	FETCH_GOALS_FAILURE = 'FETCH_GOALS_FAILURE',
}

export type FetchGoalsRequestAction = Action<GoalsActionTypes.FETCH_GOALS_REQUEST>;

export interface FetchGoalsSuccessAction extends Action<GoalsActionTypes.FETCH_GOALS_SUCCESS> {
	payload: any;
}

export interface FetchGoalsFailureAction extends Action<GoalsActionTypes.FETCH_GOALS_FAILURE> {
	error?: Error;
}

export type GoalsActions = FetchGoalsRequestAction | FetchGoalsSuccessAction | FetchGoalsFailureAction;

let dealsProgressedGoals = [];

function addMissingStages(progressByStages, selectedPipelineId: number) {
	const allStages = getStages(selectedPipelineId);
	const progressStages = progressByStages.map((stage) => ({
		id: stage.stageId,
		value: stage.sum,
		...stage,
	}));
	const stagesMissingReportsStats = differenceBy(allStages, progressStages, 'id');

	return progressStages.concat(
		stagesMissingReportsStats.map((missingStage) => ({
			id: missingStage.id,
			count: 0,
			value: 0,
		})),
	);
}

export const fetchGoals = () => async (dispatch: Dispatch<GoalsActions>, getState: () => PipelineState) => {
	const actions = bindActionCreators({ fetchStats }, dispatch);
	const state = getState();
	const selectedPipelineId = getSelectedPipelineId(state);
	const selectedFilter = getSelectedFilter(state);

	if (selectedFilter.type === 'filter') {
		return;
	}

	dispatch({
		type: GoalsActionTypes.FETCH_GOALS_REQUEST,
	});

	try {
		const getAssignee = () => {
			if (selectedFilter.type === 'user' && selectedFilter.value !== 'everyone') {
				return {
					type: 'person',
					id: selectedFilter.value,
				};
			}

			if (selectedFilter.type === 'team') {
				return {
					type: 'team',
					id: selectedFilter.value,
				};
			}

			return {
				type: 'company',
				id: getCurrentCompanyId(),
			};
		};

		const goalsArray = await api.getGoals(selectedPipelineId, getAssignee().type, getAssignee().id);

		const stagesWithGoals = goalsArray.goals.map((goal) => goal.type.params.stage_id);

		dispatch({
			type: GoalsActionTypes.FETCH_GOALS_SUCCESS,
			payload: stagesWithGoals,
		});

		dealsProgressedGoals = goalsArray.goals;

		actions.fetchStats();
	} catch (error) {
		dispatch({
			type: GoalsActionTypes.FETCH_GOALS_FAILURE,
		});
	}
};
export const fetchStats = () => async (dispatch: Dispatch<StatisticsActions>, getState: () => PipelineState) => {
	const state = getState();
	const selectedPipelineId = getSelectedPipelineId(state);
	const selectedFilter = getSelectedFilter(state);

	const goals = dealsProgressedGoals;

	const intervalTypes = {
		weekly: 'weeks',
		monthly: 'months',
		quarterly: 'quarters',
		yearly: 'years',
	};

	const uniqueGoalsByIntervals: any = goals.filter((goalsWithStatistics, index, intervals) => {
		const currentInterval = goalsWithStatistics.interval;
		const indexOfFirstInterval = intervals.findIndex((interval) => currentInterval === interval.interval);

		return indexOfFirstInterval === index;
	});

	dispatch({
		type: StatisticsActionTypes.FETCH_STATISTICS_REQUEST,
	});

	try {
		let progressByIntervals = {};

		const goalsWithStatistics = [];

		await Promise.all(
			uniqueGoalsByIntervals.map(async (goal) => {
				const progress = await api.getProgressByStages(
					getStartOfNextPeriod(intervalTypes[goal.interval]),
					getEndOfNextPeriod(intervalTypes[goal.interval]),
					selectedFilter,
					selectedPipelineId,
				);

				const progressByStages = addMissingStages(progress, selectedPipelineId);

				const getProgressByIntervals = progressByStages.reduce((stages, item) => {
					const key = intervalTypes[goal.interval];

					stages[key] = (stages[key] || []).concat(item);

					return stages;
				}, {});

				progressByIntervals = {
					...progressByIntervals,
					...getProgressByIntervals,
				};
			}),
		);

		dispatch({
			type: StatisticsActionTypes.FETCH_STATISTICS_SUCCESS,
		});

		goals.forEach((goal) => {
			const stats = omit(
				progressByIntervals[intervalTypes[goal.interval]].filter(
					(progress) => progress.id === goal.type.params.stage_id,
				)[0],
				['id'],
			);

			goalsWithStatistics.push({
				expected: goal.expected_outcome,
				params: goal.type.params,
				interval: goal.interval,
				duration: goal.duration,
				stats,
			});
		});

		dispatch({
			type: StatisticsActionTypes.SET_GOALS_WITH_STATISTICS,
			payload: goalsWithStatistics,
		});
	} catch (error) {
		dispatch({
			type: StatisticsActionTypes.FETCH_STATISTICS_FAILURE,
		});
	}
};
