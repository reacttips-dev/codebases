import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import FunnelConversionTitle from './FunnelConversionTitle';
import DurationTitle from './DurationTitle';
import {
	FunnelChartSummaryDataObject,
	DurationChartSummaryDataObject,
	MapDataReturnType,
} from '../../types/data-layer';

interface ChartTitleWrapperProps {
	reportType: insightsTypes.ReportType;
	chartType: insightsTypes.ChartType;
	reportData: MapDataReturnType;
	measureByFilter: string;
	measureByCustomName?: string;
	isInWidget?: boolean;
}

const ChartTitleWrapper = ({
	reportType,
	reportData,
	measureByFilter,
	measureByCustomName,
	chartType,
	isInWidget = false,
}: ChartTitleWrapperProps) => {
	if (!reportData?.chartSummaryData) {
		return null;
	}

	const { chartSummaryData } = reportData;

	if (reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION) {
		const { groupedAndSegmentedData } = reportData;

		return (
			<FunnelConversionTitle
				data={groupedAndSegmentedData}
				measureByFilter={measureByFilter}
				measureByCustomName={measureByCustomName}
				chartSummaryData={
					chartSummaryData as FunnelChartSummaryDataObject
				}
				isInWidget={isInWidget}
			/>
		);
	}

	if (
		reportType === insightsTypes.ReportType.DEALS_DURATION &&
		chartType !== insightsTypes.ChartType.SCORECARD
	) {
		return (
			<DurationTitle
				chartSummaryData={
					chartSummaryData as DurationChartSummaryDataObject
				}
				isInWidget={isInWidget}
			/>
		);
	}

	return null;
};

export default ChartTitleWrapper;
