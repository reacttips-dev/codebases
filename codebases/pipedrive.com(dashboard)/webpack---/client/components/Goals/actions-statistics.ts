import { Action } from 'redux';

export enum StatisticsActionTypes {
	FETCH_STATISTICS_REQUEST = 'FETCH_STATISTICS_REQUEST',
	FETCH_STATISTICS_SUCCESS = 'FETCH_STATISTICS_SUCCESS',
	FETCH_STATISTICS_FAILURE = 'FETCH_STATISTICS_FAILURE',
	SET_GOALS_WITH_STATISTICS = 'SET_GOALS_WITH_STATISTICS',
}

export type FetchStatisticsRequestAction = Action<StatisticsActionTypes.FETCH_STATISTICS_REQUEST>;

export type FetchStatisticsSuccessAction = Action<StatisticsActionTypes.FETCH_STATISTICS_SUCCESS>;

export interface SetGoalsWithStatisticsAction extends Action<StatisticsActionTypes.SET_GOALS_WITH_STATISTICS> {
	payload: any;
}

export interface FetchStatisticsFailureAction extends Action<StatisticsActionTypes.FETCH_STATISTICS_FAILURE> {
	error?: Error;
}

export type StatisticsActions =
	| FetchStatisticsRequestAction
	| FetchStatisticsSuccessAction
	| FetchStatisticsFailureAction
	| SetGoalsWithStatisticsAction;
