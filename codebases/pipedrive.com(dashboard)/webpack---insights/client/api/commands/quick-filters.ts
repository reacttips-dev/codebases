import { Filter } from '@pipedrive/insights-core/lib/types';

import { SettingsApiClient as client } from '../apollo/settingsApiClient';
import { Dashboard } from '../../types/apollo-query-types';
import {
	formatPeriodFilter,
	parseQuickFilters,
} from '../../utils/quickFilterUtils';
import { GET_USER_SETTINGS, UPDATE_QUICK_FILTERS } from '../graphql';
import { getCurrentUserId } from '../webapp';

export const getQuickFilters = (dashboardId: string) => {
	if (window.app.isPublic) {
		return { user: null, period: null };
	}

	const userId = getCurrentUserId();
	const {
		currentUserSettings: { dashboards },
	} = client.readQuery({
		query: GET_USER_SETTINGS,
	});

	const dashboard: Dashboard = dashboards.find(
		(dashboardItem: Dashboard) => dashboardItem.id === dashboardId,
	);

	if (dashboard) {
		return parseQuickFilters(dashboard.quick_filters, userId);
	}

	return { user: null, period: null };
};

export const updateQuickFilters = async ({
	dashboardId,
	period,
	user,
}: {
	dashboardId: string;
	period: Filter;
	user: Filter;
}) => {
	return await client.mutate({
		mutation: UPDATE_QUICK_FILTERS,
		variables: {
			id: dashboardId,
			quick_filters: {
				period: period
					? JSON.stringify(formatPeriodFilter(period, true))
					: null,
				user: user ? JSON.stringify(user) : null,
			},
		},
	});
};
