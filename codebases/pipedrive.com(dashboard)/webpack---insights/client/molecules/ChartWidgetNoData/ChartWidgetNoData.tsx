import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import { isPublicPage } from '../../utils/helpers';
import { getWidgetNoDataMessage } from '../Chart/chartUtils';
import WidgetNoData from '../../atoms/WidgetNoData';
import { GoalError } from '../../types/goals';

interface ChartWidgetNoDataProps {
	chartType: insightsTypes.ChartType;
	isGoalsReport: boolean;
	goalErrorType?: GoalError;
	navigateToReportDetails: () => void;
	canEditDashboard: boolean;
}

const ChartWidgetNoData: React.FC<ChartWidgetNoDataProps> = ({
	chartType,
	isGoalsReport,
	goalErrorType,
	navigateToReportDetails,
	canEditDashboard,
}) => {
	const translator = useTranslator();

	const { messageText, buttonText } = getWidgetNoDataMessage({
		isGoalsReport,
		goalErrorType,
		canEditDashboard,
		translator,
	});

	return (
		<WidgetNoData
			onEditReportClick={navigateToReportDetails}
			chartType={chartType}
			isPublic={isPublicPage()}
			message={messageText}
			buttonText={buttonText}
			isGoalsReport={isGoalsReport}
		/>
	);
};

export default React.memo(ChartWidgetNoData);
