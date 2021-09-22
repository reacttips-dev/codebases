import React from 'react';
import { ApolloError } from '@apollo/client';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { trackingParamsVar } from '../../../api/vars/settingsApi';
import ReportErrorMessage from '../../../atoms/ReportErrorMessage';
import WidgetTop from '../../../dashboard/widget/widgetWrapper/widgetTop/WidgetTop';
import useRouter from '../../../hooks/useRouter';
import { SideMenuItemGroup } from '../../../utils/constants';
import { isPublicPage } from '../../../utils/helpers';
import {
	ENTRYPOINT_PROPERTIES,
	REPORT_OPENED_SOURCE_PROPERTIES,
} from '../../../utils/metrics/analytics-properties';
import { getGoalByReportId } from '../../../hooks/goals/goalUtils';

interface ReportErrorProps {
	containsInactiveCustomFields?: boolean;
	dashboardId: string;
	error?: ApolloError | boolean;
	isGoalsReport: boolean;
	isWidget: boolean;
	reportDataType: insightsTypes.DataType;
	reportId: string;
	reportName: string;
	reportType: insightsTypes.ReportType;
}

const ReportError = ({
	containsInactiveCustomFields,
	dashboardId,
	error,
	isGoalsReport,
	isWidget,
	reportDataType,
	reportId,
	reportName,
	reportType,
}: ReportErrorProps): JSX.Element => {
	const [goTo] = useRouter();
	const goal = getGoalByReportId(reportId);
	const goalId = goal?.id;

	const navigateToReportDetails = () => {
		goTo(
			isGoalsReport
				? {
						id: goalId,
						type: SideMenuItemGroup.GOALS,
				  }
				: {
						id: reportId,
						type: SideMenuItemGroup.REPORTS,
				  },
		);
	};

	const handleNavigation = () => {
		trackingParamsVar({
			source: REPORT_OPENED_SOURCE_PROPERTIES.dashboard,
			entryPoint: ENTRYPOINT_PROPERTIES.reports,
		});

		navigateToReportDetails();
	};

	const shouldShowWidgetTop = isWidget && !isPublicPage();

	return (
		<>
			{shouldShowWidgetTop && (
				<WidgetTop
					reportId={reportId}
					reportName={reportName}
					reportType={reportType}
					reportDataType={reportDataType}
					isGoalsReport={isGoalsReport}
					dashboardId={dashboardId}
					handleNavigation={handleNavigation}
					goal={goal}
				/>
			)}
			<ReportErrorMessage
				isPublicPage={isPublicPage()}
				error={error}
				isWidget={!!isWidget}
				reportId={reportId}
				reportName={reportName}
				containsInactiveCustomFields={containsInactiveCustomFields}
			/>
		</>
	);
};

export default ReportError;
