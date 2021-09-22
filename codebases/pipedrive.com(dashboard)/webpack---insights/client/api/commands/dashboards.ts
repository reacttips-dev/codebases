import update from 'immutability-helper';

import { SettingsApiClient as client } from '../apollo/settingsApiClient';
import {
	Dashboard,
	DashboardReport,
	Report,
	SharingOption,
} from '../../types/apollo-query-types';
import { getInheritedSharingOptions } from '../../utils/sharingUtils';
import {
	CREATE_DASHBOARD,
	DELETE_DASHBOARD,
	GET_PUBLIC_DASHBOARD_SETTINGS,
	GET_USER_SETTINGS,
	RENAME_DASHBOARD,
	UPDATE_DASHBOARD_REPORTS,
	UPDATE_DASHBOARD_SHARING,
} from '../graphql';

export const createDashboard = async (
	name: string,
	reports: Partial<DashboardReport>[] = [],
) => {
	const {
		currentUserSettings: { dashboards },
	} = client.readQuery({
		query: GET_USER_SETTINGS,
	});

	const sidemenuPosition = dashboards.reduce(
		(prev: Dashboard, current: Dashboard) => {
			return prev.sidemenu_position > current.sidemenu_position
				? prev.sidemenu_position + 1
				: current.sidemenu_position + 1;
		},
		{},
	);

	return client.mutate({
		mutation: CREATE_DASHBOARD,
		variables: {
			name,
			sidemenu_position: sidemenuPosition,
			reports,
		},
		update: (cache, { data: { createDashboard } }) => {
			const { currentUserSettings, commonSettings } = cache.readQuery({
				query: GET_USER_SETTINGS,
			});

			cache.writeQuery({
				query: GET_USER_SETTINGS,
				data: {
					currentUserSettings: {
						...currentUserSettings,
						dashboards: currentUserSettings.dashboards.concat([
							createDashboard,
						]),
					},
					commonSettings,
				},
			});
		},
	});
};

export const renameDashboard = async (dashboardId: string, name: string) => {
	await client.mutate({
		mutation: RENAME_DASHBOARD,
		variables: {
			id: dashboardId,
			name,
		},
	});
};

export const updateDashboardSharing = async (
	dashboardId: string,
	sharedWith: SharingOption[],
) => {
	await client.mutate({
		mutation: UPDATE_DASHBOARD_SHARING,
		variables: {
			id: dashboardId,
			shared_with: sharedWith,
		},
		update: (cache) => {
			const { currentUserSettings, commonSettings } = cache.readQuery({
				query: GET_USER_SETTINGS,
			});

			cache.writeQuery({
				query: GET_USER_SETTINGS,
				data: {
					currentUserSettings: update(currentUserSettings, {
						reports: {
							$apply: (reports: Report[]) => {
								return reports.map((report) => {
									return {
										...report,
										shared_with: getInheritedSharingOptions(
											report,
											currentUserSettings.dashboards,
										),
									};
								});
							},
						},
					}),
					commonSettings,
				},
			});
		},
	});
};

export const deleteDashboard = async (dashboardId: string) => {
	await client.mutate({
		mutation: DELETE_DASHBOARD,
		variables: {
			id: dashboardId,
		},
		update: (cache) => {
			const { currentUserSettings, commonSettings } = cache.readQuery({
				query: GET_USER_SETTINGS,
			});

			const filteredDashboards = currentUserSettings.dashboards.filter(
				(i: Dashboard) => i.id !== dashboardId,
			);

			cache.writeQuery({
				query: GET_USER_SETTINGS,
				data: {
					currentUserSettings: update(currentUserSettings, {
						dashboards: {
							$set: filteredDashboards,
						},
						reports: {
							$apply: (reports: Report[]) => {
								return reports.map((report) => {
									return {
										...report,
										shared_with: getInheritedSharingOptions(
											report,
											filteredDashboards,
										),
									};
								});
							},
						},
					}),
					commonSettings,
				},
			});
		},
	});
};

export const updateDashboardReports = async (
	dashboardId: string,
	reports: DashboardReport[],
) => {
	await client.mutate({
		mutation: UPDATE_DASHBOARD_REPORTS,
		variables: {
			id: dashboardId,
			reports,
		},
		update: (cache) => {
			const { currentUserSettings, commonSettings } = cache.readQuery({
				query: GET_USER_SETTINGS,
			});

			cache.writeQuery({
				query: GET_USER_SETTINGS,
				data: {
					currentUserSettings: update(currentUserSettings, {
						reports: {
							$apply: (reports: Report[]) => {
								return reports.map((report) => {
									return {
										...report,
										shared_with: getInheritedSharingOptions(
											report,
											currentUserSettings.dashboards,
										),
									};
								});
							},
						},
					}),
					commonSettings,
				},
			});
		},
	});
};

export const findDashboardById = (
	dashboardId: string,
	isViewingPublicPage: boolean,
) => {
	const {
		currentUserSettings: { dashboards },
	} = client.readQuery({
		query: isViewingPublicPage
			? GET_PUBLIC_DASHBOARD_SETTINGS
			: GET_USER_SETTINGS,
	});

	return dashboards.find(
		(dashboardItem: Dashboard) => dashboardItem.id === dashboardId,
	);
};
