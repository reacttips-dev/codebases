import { SortingRule } from 'react-table';
import { useTranslator } from '@pipedrive/react-utils';
import { helpers, types as insightsTypes } from '@pipedrive/insights-core';

import { isCellRightAligned, makeRowObject } from './summaryTableRowUtils';
import {
	HeaderObject,
	getColumnSortType,
	addHeadersBasedOnSegments,
} from './summaryTableHeaderUtils';
import { getSummaryTableCellFormat } from '../../utils/valueFormatter';
import { MapDataReturnType } from '../../types/data-layer';
import { Goal } from '../../types/goals';
import { isRevenueGoal } from '../../molecules/GoalDetailsModal/goalDetailsModalUtils';
import { TABLE_DATA_AVERAGE, TABLE_DATA_TOTAL } from '../../utils/constants';

const useSummaryTableForGoal = ({
	reportType,
	reportData,
	primaryFilter,
	measureByFilter,
	primaryFilterName,
	reportDataType,
	goal,
}: {
	reportType: insightsTypes.ReportType;
	reportData: MapDataReturnType;
	primaryFilter: string;
	measureByFilter: string;
	primaryFilterName: string;
	reportDataType: insightsTypes.DataType;
	goal: Goal;
}) => {
	const translator = useTranslator();

	const measureByFilterType = helpers.getMeasureByStatsFieldKey(
		reportDataType,
		measureByFilter,
	);
	const goalColumnId = 'goal';
	const resultColumnId = measureByFilterType;
	const differenceColumnId = 'differenceBetweenGoalAndResult';
	const goalColumnValueFormat = getSummaryTableCellFormat({
		reportType,
		headerId: goalColumnId,
		measureByFilter,
	});
	const resultColumnValueFormat = getSummaryTableCellFormat({
		reportType,
		headerId: resultColumnId,
		measureByFilter,
	});
	const differenceColumnValueFormat = getSummaryTableCellFormat({
		reportType,
		headerId: differenceColumnId,
		measureByFilter,
	});
	const isRevenueForecastGoal = isRevenueGoal(goal?.type?.name);

	const headers = [
		{
			Header:
				reportType === insightsTypes.ReportType.DEALS_REVENUE_FORECAST
					? translator.gettext('Forecast period')
					: primaryFilterName || '',
			accessor: primaryFilter,
			id: primaryFilter,
			sortType: 'alphanumeric',
		},
		{
			Header: translator.gettext('Goal'),
			accessor: goalColumnId,
			id: goalColumnId,
			sortType: getColumnSortType(goalColumnValueFormat),
		},
	] as HeaderObject[];

	if (isRevenueForecastGoal) {
		addHeadersBasedOnSegments({
			reportData,
			headers,
			reportType,
			translator,
			measureByFilter,
		});
	}

	headers.push(
		{
			Header: isRevenueForecastGoal
				? translator.gettext('Total')
				: translator.gettext('Result'),
			accessor: resultColumnId,
			id: resultColumnId,
			sortType: getColumnSortType(resultColumnValueFormat),
		},
		{
			Header: translator.gettext('Difference'),
			accessor: differenceColumnId,
			id: differenceColumnId,
			sortType: getColumnSortType(differenceColumnValueFormat),
		},
	);

	const rows = reportData.groupedAndSegmentedFlatData.reduce(
		(rows, segment, index) => {
			const EXCLUDED_SEGMENTS = [TABLE_DATA_AVERAGE, TABLE_DATA_TOTAL];

			if (!EXCLUDED_SEGMENTS.includes(segment.id)) {
				const {
					expected_outcome: { target },
				} = goal;

				const goalTarget = isRevenueForecastGoal
					? (index + 1) * target
					: target;

				const segmentWithGoal = {
					...segment,
					goal: goalTarget,
					differenceBetweenGoalAndResult:
						segment[measureByFilterType] - goalTarget,
				};

				rows.push(
					makeRowObject({
						reportType,
						primaryFilter,
						measureByFilter,
						headers,
						segment: segmentWithGoal,
						isGoalReport: true,
						translator,
					}),
				);
			}

			return rows;
		},
		[],
	);

	const sortBy: SortingRule<any>[] = [];

	return {
		sortBy,
		headers,
		rows,
		isCellRightAligned: (key: string) =>
			isCellRightAligned(key, primaryFilter),
	};
};

export default useSummaryTableForGoal;
