import { getRouter, isForecastEnabled } from '../../shared/api/webapp';
import { getSelectedPipelineId } from '../../selectors/pipelines';
import { getPeriodStartDate } from '../selectors/periodStartDate';
import { getSelectedFilter } from '../../selectors/filters';
import {
	getShowByOption,
	getArrangeByOption,
	getChangeIntervalOption,
	getNumberOfColumnsOption,
} from '../selectors/settings';

// eslint-disable-next-line max-params
export function changeForecastUrl(
	interval: string,
	periodStartDate: string,
	showBy: string,
	pipelineId: number,
	selectedFilter: Pipedrive.SelectedFilter,
	numberOfColumns: number,
	arrangeBy: 'won' | 'open',
): void {
	if (
		!isForecastEnabled() ||
		!interval ||
		!showBy ||
		!pipelineId ||
		!selectedFilter ||
		!numberOfColumns ||
		!arrangeBy
	) {
		getRouter().navigateTo('/timeline');

		return;
	}

	const filter = `${selectedFilter.type}_${selectedFilter.value}`;

	getRouter().navigateTo(
		`/timeline/${interval}/${periodStartDate}/${showBy};${pipelineId};${filter};${numberOfColumns};${
			arrangeBy === 'won' ? 1 : 0
		};1;1`,
	);
}

export function createUrlFromState(state: ForecastState) {
	const pipelineId = getSelectedPipelineId(state);
	const periodStartDate = getPeriodStartDate(state);
	const filter = getSelectedFilter(state);
	const showBy = getShowByOption(state);
	const arrangeBy = getArrangeByOption(state);
	const interval = getChangeIntervalOption(state);
	const numberOfColumns = getNumberOfColumnsOption(state);

	changeForecastUrl(interval, periodStartDate, showBy, pipelineId, filter, numberOfColumns, arrangeBy);
}
