import React from 'react';

import { getReportById, getDashboardById } from '../utils/helpers';
import SnackbarMessage from '../atoms/SnackbarMessage';
import Report from './Report';
import {
	Dashboard,
	Report as ReportType,
	SelectedItem,
	SelectedItemType,
} from '../types/apollo-query-types';
import { ContentWrapper } from '../shared';

interface ReportWrapperProps {
	selectedItem: SelectedItem;
	dashboards: Dashboard[];
	reports: ReportType[];
	snackbarMessage: string;
	handleRoutingFallback: Function;
}

const ReportWrapper: React.FC<ReportWrapperProps> = ({
	selectedItem,
	dashboards,
	reports,
	snackbarMessage,
	handleRoutingFallback,
}) => {
	const report = getReportById(selectedItem.id, reports);
	const hasNoItems = !reports[0] || !report;

	if (hasNoItems) {
		return handleRoutingFallback({
			items: reports,
			item: report,
			itemType: SelectedItemType.REPORTS,
			fallbackItem:
				getDashboardById(selectedItem.id, dashboards) || dashboards[0],
			fallbackItemType: SelectedItemType.DASHBOARDS,
		});
	}

	return (
		<ContentWrapper>
			<Report reportId={report.id} />
			<SnackbarMessage message={snackbarMessage} />
		</ContentWrapper>
	);
};

export default ReportWrapper;
