import { flatMap, uniq } from 'lodash';

export const getSummaryByStages = (state: PipelineState): { [id: number]: Pipedrive.DealsByStagesSummaryPerStages } =>
	state.summary.byStages;

export const getSummaryByStagesConverted = (
	state: PipelineState,
): { [id: number]: Pipedrive.DealsByStagesSummaryPerStagesConverted } => {
	return Object.keys(state.summary.byStagesConverted).reduce((acc, el) => {
		return {
			...acc,
			[el]: {
				...state.summary.byStagesConverted[el],
				details: state.summary.byStages[el],
			},
		};
	}, {});
};

export const getAllCurrencies = (state: PipelineState): string[] => {
	const allCurrencies = flatMap(Object.values(getSummaryByStages(state)), (stage) => Object.keys(stage));

	return uniq(allCurrencies);
};

export const getTotalSummary = (state: Viewer.State | PipelineState): Pipedrive.DealsSummaryData => state.summary.deals;
