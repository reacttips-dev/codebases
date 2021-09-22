import { flatMap, isNil } from 'lodash';
import { createSelector } from 'reselect';
import { getSummaryByStages } from './summary';
import getDealActivityStatus from '../utils/getDealActivityStatus';
import { ActivityStatusTypes } from '../utils/constants';

export const getDealsByStages = (state: PipelineState): { [key: number]: Pipedrive.Deal[] } => state.deals.byStages;
export const getDealsLoadingStatus = (state: PipelineState) => state.deals.isLoading;
export const getAllDeals = (state: PipelineState) => flatMap(Object.values(getDealsByStages(state)), (deals) => deals);
export const getAllDealsCount = (state: PipelineState) => {
	const allDeals = getAllDeals(state);

	return allDeals.length;
};
export const getDeal = (state: PipelineState, dealId: number): Pipedrive.Deal => {
	const allDeals = getAllDeals(state);

	return allDeals.find((deal) => deal.id === dealId);
};
export const getDealsWithoutScheduledActivityCount = (state: PipelineState) => {
	const allDeals = getAllDeals(state);

	return allDeals.filter((deal) => getDealActivityStatus(deal) === ActivityStatusTypes.NONE).length;
};
export const getDealsWithActivitiesDueInFutureCount = (state: PipelineState) => {
	const allDeals = getAllDeals(state);

	return allDeals.filter((deal) => getDealActivityStatus(deal) === ActivityStatusTypes.PLANNED).length;
};
export const getDealsWithActivitiesDueTodayCount = (state: PipelineState): number => {
	const allDeals = getAllDeals(state);

	return allDeals.filter((deal) => getDealActivityStatus(deal) === ActivityStatusTypes.TODAY).length;
};
export const getDealsWithActivitiesOverdueCount = (state: PipelineState): number => {
	const allDeals = getAllDeals(state);

	return allDeals.filter((deal) => getDealActivityStatus(deal) === ActivityStatusTypes.OVERDUE).length;
};
export const getRottenDealsCount = (state: PipelineState): number => {
	const allDeals = getAllDeals(state);

	return allDeals.filter((deal) => !isNil(deal.rotten_time)).length;
};
export const isLoading = (state: PipelineState) => state.deals.isLoading;
export const hasMoreDeals = (state: PipelineState) => state.deals.hasMoreDeals;
export const getLoadedDealsCount = (state: PipelineState) => state.deals.loadedDealsCount;
export const isError = (state: PipelineState) => state.deals.isError;
export const getStagesWithoutAllDeals = createSelector(
	getDealsByStages,
	getSummaryByStages,
	(dealsByStages, summaryByStages): number[] => {
		if (!dealsByStages || !summaryByStages) {
			return [];
		}

		const removeStageWithAllDealsLoaded = (stageId: string) => {
			const totalDeals = Object.values(summaryByStages[stageId] || {}).reduce(
				(total: number, { count }) => total + count,
				0,
			);
			const dealsInStage = (dealsByStages[stageId] || []).length;

			return dealsInStage < totalDeals;
		};

		return Object.keys(dealsByStages)
			.filter(removeStageWithAllDealsLoaded)
			.map((stageId: string) => Number(stageId));
	},
);
