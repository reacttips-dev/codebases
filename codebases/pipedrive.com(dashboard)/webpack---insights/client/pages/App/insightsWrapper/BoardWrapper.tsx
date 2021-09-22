import React from 'react';
import { useReactiveVar } from '@apollo/client';

import useRouter from '../../../hooks/useRouter';
import localState from '../../../utils/localState';
import NotFound from '../../../atoms/NotFound';
import {
	Report as ReportResponse,
	SelectedItem,
	SelectedItemType,
} from '../../../types/apollo-query-types';
import { Goal as GoalResponse } from '../../../types/goals';
import GoalWrapper from '../../../goal/GoalWrapper';
import ReportWrapper from '../../../report/ReportWrapper';
import DashboardWrapper from '../../../dashboard/DashboardWrapper';
import { snackbarMessageVar } from '../../../api/vars/settingsApi';
import { getReportsOfReportType } from '../../../shared/featureCapping/cappingUtils';

interface BoardWrapperProps {
	selectedItem: SelectedItem;
}

const BoardWrapper: React.FC<BoardWrapperProps> = ({ selectedItem }) => {
	const [goTo] = useRouter();
	const { getCurrentUserSettings } = localState();
	const { dashboards, reports } = getCurrentUserSettings();
	const snackbarMessage = useReactiveVar(snackbarMessageVar);

	const handleRoutingFallback = ({
		items,
		item,
		itemType,
		fallbackItem,
		fallbackItemType,
	}: {
		items: (GoalResponse | ReportResponse)[];
		itemType: string;
		fallbackItem: { id: string };
		fallbackItemType: string;
		item?: GoalResponse | ReportResponse;
	}) => {
		if (!item) {
			if (!items[0]) {
				goTo({
					id: fallbackItem.id,
					type: fallbackItemType,
				});

				return <NotFound />;
			}

			const ownReports = getReportsOfReportType(items);

			if (itemType === SelectedItemType.REPORTS && ownReports.length) {
				goTo({
					id: ownReports[0].id,
					type: itemType,
				});
			} else {
				goTo({
					id: items[0].id,
					type: itemType,
				});
			}

			return <NotFound />;
		}

		return null;
	};

	if (selectedItem.type === SelectedItemType.REPORTS) {
		return (
			<ReportWrapper
				selectedItem={selectedItem}
				dashboards={dashboards}
				reports={reports}
				snackbarMessage={snackbarMessage}
				handleRoutingFallback={handleRoutingFallback}
			/>
		);
	}

	if (selectedItem.type === SelectedItemType.GOALS) {
		return (
			<GoalWrapper
				selectedItem={selectedItem}
				dashboards={dashboards}
				snackbarMessage={snackbarMessage}
				handleRoutingFallback={handleRoutingFallback}
			/>
		);
	}

	return (
		<DashboardWrapper
			selectedItem={selectedItem}
			dashboards={dashboards}
			snackbarMessage={snackbarMessage}
		/>
	);
};

export default BoardWrapper;
