import { ApolloClient, InMemoryCache } from '@apollo/client';

import { getUrl, headers } from './utils';
import { selectedDataFilters } from '../mock';
import {
	isDraggingReportVar,
	isViewInFocusVar,
	selectedItemVar,
	snackbarMessageVar,
	trackingParamsVar,
} from '../vars/settingsApi';

export const SettingsApiCache = new InMemoryCache({
	typePolicies: {
		/**
		 * dashboard.reports and dashboardReports.reports should have
		 * their own report arrays.
		 */
		dashboarddashboard: {
			fields: {
				reports: {
					merge(_, incoming) {
						return incoming;
					},
				},
			},
		},
		dashboarddashboardReports: {
			keyFields: ['id', 'position'],
			fields: {
				reports: {
					merge(existing = [], incoming) {
						return [...existing, ...incoming];
					},
				},
			},
		},
		ReportsSettings: {
			merge: true,
		},
		/**
		 * Allows reading reactive variables through regular GraphQL queries.
		 */
		Query: {
			fields: {
				isDraggingReport() {
					return isDraggingReportVar();
				},
				selectedItem() {
					return selectedItemVar();
				},
				snackbarMessage() {
					return snackbarMessageVar();
				},
				trackingParams() {
					return trackingParamsVar();
				},
				selectedDataFilters() {
					return selectedDataFilters;
				},
				isViewInFocus() {
					return isViewInFocusVar();
				},
			},
		},
	},
});

export const SettingsApiClient = new ApolloClient({
	name: 'SettingsApi',
	uri: getUrl(
		window?.app?.isPublic
			? '/insights-public-gateway/settings-api'
			: '/api/insights-settings-api/graphql',
	),
	cache: SettingsApiCache,
	...headers,
});
