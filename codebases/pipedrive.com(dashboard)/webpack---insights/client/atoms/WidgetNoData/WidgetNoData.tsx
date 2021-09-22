import React from 'react';
import { Button } from '@pipedrive/convention-ui-react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import EmptyColumnChartSVG from '../../utils/svg/EmptyColumnChart.svg';
import EmptyBarChartSVG from '../../utils/svg/EmptyBarChart.svg';
import EmptyPieChartSVG from '../../utils/svg/EmptyPieChart.svg';
import EmptyTableChartSVG from '../../utils/svg/EmptyTableChart.svg';
import EmptyGoalChartSVG from '../../utils/svg/EmptyGoalChart.svg';
import EmptyScorecardChartSVG from '../../utils/svg/EmptyScorecardChart.svg';

import styles from './WidgetNoData.pcss';

export interface WidgetNoDataProps {
	onEditReportClick: () => void;
	chartType: insightsTypes.ChartType;
	message: string;
	isPublic: boolean;
	buttonText?: string;
	isGoalsReport?: boolean;
}

const WidgetNoData: React.FC<WidgetNoDataProps> = ({
	isPublic,
	buttonText,
	chartType,
	message,
	onEditReportClick,
	isGoalsReport = false,
}) => {
	const getChartIcon = () => {
		switch (chartType) {
			case insightsTypes.ChartType.FUNNEL:
			case insightsTypes.ChartType.COLUMN:
				return <EmptyColumnChartSVG />;
			case insightsTypes.ChartType.BAR:
				return <EmptyBarChartSVG />;
			case insightsTypes.ChartType.PIE:
				return <EmptyPieChartSVG />;
			case insightsTypes.ChartType.TABLE:
				return <EmptyTableChartSVG />;
			case insightsTypes.ChartType.STACKED_BAR_CHART:
				return <EmptyColumnChartSVG />;
			case insightsTypes.ChartType.SCORECARD:
				return <EmptyScorecardChartSVG />;
			default:
				return null;
		}
	};

	const renderIcon = () => {
		if (isGoalsReport) {
			return <EmptyGoalChartSVG />;
		}

		return getChartIcon();
	};

	return (
		<div
			className={styles.wrapper}
			data-tracking="widget-empty"
			data-test="widget-empty"
		>
			{renderIcon()}
			<p className={styles.text}>{message}</p>
			{buttonText && !isPublic && (
				<Button onClick={() => onEditReportClick()}>
					{buttonText}
				</Button>
			)}
		</div>
	);
};

export default React.memo(WidgetNoData);
