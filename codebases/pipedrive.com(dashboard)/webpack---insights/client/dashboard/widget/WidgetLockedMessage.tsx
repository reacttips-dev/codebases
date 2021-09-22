import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import useRouter from '../../hooks/useRouter';
import WidgetCustomfieldsLockedMessage from './WidgetCustomfieldsLockedMessage';
import WidgetRevenueLockedMessage from './WidgetRevenueLockedMessage';
import GoalWidgetLockedMessage from './GoalWidgetLockedMessage';
import WidgetWrapper from './widgetWrapper/WidgetWrapper';
import PublicWidgetNotAvailableMessage from '../../atoms/NotAvailableMessage/PublicWidgetNotAvailableMessage';
import { isPublicPage } from '../../utils/helpers';
import { Goal } from '../../types/goals';

import styles from './Widget.pcss';

interface WidgetLockedMessageProps {
	report: any;
	goal?: Goal;
}

const WidgetLockedMessage: React.FC<WidgetLockedMessageProps> = ({
	report,
	goal,
}) => {
	const translator = useTranslator();
	const isGoalReport = report.is_goals_report;

	const [goTo] = useRouter();
	const handleNavigationToReportDetails = () => {
		if (isGoalReport && goal) {
			goTo({
				id: goal.id,
				type: 'goals',
			});
		} else {
			goTo({
				id: report.id,
				type: 'reports',
			});
		}
	};

	const isRecurringRevenueReport =
		report.report_type ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE ||
		report.report_type ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT;

	const renderLockedMessage = () => {
		if (isPublicPage()) {
			return (
				<PublicWidgetNotAvailableMessage
					informativeText={translator.gettext(
						'This report is not available',
					)}
				/>
			);
		}

		if (isRecurringRevenueReport) {
			return (
				<WidgetRevenueLockedMessage
					reportId={report.id}
					reportName={report.name}
				/>
			);
		}

		if (isGoalReport) {
			return (
				<GoalWidgetLockedMessage
					reportId={report.id}
					goalName={goal?.name}
				/>
			);
		}

		return (
			<WidgetCustomfieldsLockedMessage
				reportId={report.id}
				reportName={report.name}
			/>
		);
	};

	return (
		<div className={styles.widget} data-test={`widget-${report.name}`}>
			<WidgetWrapper
				navigateToReportDetails={handleNavigationToReportDetails}
				report={report}
				hasSegment
				goal={goal}
			>
				{renderLockedMessage()}
			</WidgetWrapper>
		</div>
	);
};

export default WidgetLockedMessage;
