import React from 'react';

import useRouter from '../hooks/useRouter';
import NotFound from '../atoms/NotFound';
import SnackbarMessage from '../atoms/SnackbarMessage';
import Dashboard from './Dashboard';
import {
	Dashboard as DashboardResponse,
	SelectedItem,
	SelectedItemType,
} from '../types/apollo-query-types';
import { ContentWrapper } from '../shared';
import usePlanPermissions from '../hooks/usePlanPermissions';
import { doesItemHaveAnotherOwner } from '../utils/sharingUtils';
import { PERMISSION_TYPES } from '../utils/constants';
import { getCurrentUserId } from '../api/webapp';

interface DashboardWrapperProps {
	dashboards: DashboardResponse[];
	selectedItem: SelectedItem;
	snackbarMessage: string;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({
	dashboards,
	selectedItem,
	snackbarMessage,
}) => {
	const [goTo] = useRouter();
	const currentUserId = getCurrentUserId();
	const { hasPermission } = usePlanPermissions();
	const dashboard = dashboards.find((item) => item.id === selectedItem.id);

	if (!dashboard) {
		goTo({
			id: dashboards[0].id,
			type: SelectedItemType.DASHBOARDS,
		});

		return <NotFound />;
	}

	const canSeeCurrentDashboard =
		doesItemHaveAnotherOwner(dashboard, currentUserId) ||
		hasPermission(
			PERMISSION_TYPES.dynamic.seeThisDashboard,
			dashboards
				.filter((item) => item.user_id === currentUserId)
				.findIndex((item) => item.id === selectedItem.id),
		);

	return (
		<ContentWrapper>
			<Dashboard
				dashboard={dashboard}
				canSeeCurrentDashboard={canSeeCurrentDashboard}
			/>
			<SnackbarMessage message={snackbarMessage} />
		</ContentWrapper>
	);
};

export default DashboardWrapper;
