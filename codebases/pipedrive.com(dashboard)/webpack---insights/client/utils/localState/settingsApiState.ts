import { ApolloClient } from '@apollo/client';
import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	GET_USER_SETTINGS,
	GET_PUBLIC_DASHBOARD_SETTINGS,
} from '../../api/graphql';
import { getReportById, getDashboardById, isPublicPage } from '../helpers';
import {
	SelectedItem,
	GetReportTypesResponse,
	Dashboard,
	Report,
	RelatedObjects,
} from '../../types/apollo-query-types';
import { ReportParentType } from '../constants';
import { Goal } from '../../types/goals';
import { getGoals } from '../../hooks/goals/goalUtils';
import { selectedItemVar } from '../../api/vars/settingsApi';
import { trackPageOpenedEvent } from '../metrics/page-opened';

export const getSelectedItemId = () => {
	const goals = getGoals();
	const selectedItem = selectedItemVar();

	const goal = goals?.find((goal: Goal) => goal.id === selectedItem.id);
	const reportId = goal ? goal.report_ids[0] : selectedItem.id;

	return selectedItem && reportId;
};

export const setSelectedItem = async (selectedItem: SelectedItem) => {
	trackPageOpenedEvent(selectedItem);

	return selectedItemVar(selectedItem);
};

const settingsApiState = (client: ApolloClient<any>) => {
	const getCurrentUserSettings = (): {
		dashboards: Dashboard[];
		reports: Report[];
		relatedObjects: RelatedObjects;
	} => {
		const {
			currentUserSettings: { dashboards, reports, relatedObjects },
		} = client.readQuery({
			query: isPublicPage()
				? GET_PUBLIC_DASHBOARD_SETTINGS
				: GET_USER_SETTINGS,
		});

		return {
			dashboards,
			reports,
			relatedObjects,
		};
	};

	const getDefaultReportFilters = (
		reportParentType: ReportParentType,
		reportSubType: insightsTypes.ReportType,
	) => {
		const {
			commonSettings: { reportTypes },
		} = client.readQuery<GetReportTypesResponse>({
			query: GET_USER_SETTINGS,
		});

		const report = reportTypes.find(
			({ type }) => type === reportParentType,
		);
		const selectedSubtype = report.subtypes.find(
			({ subtype }) => subtype === reportSubType,
		);

		return selectedSubtype?.defaultReport?.parameters?.filter_by;
	};

	const getPublicDashboardSettings = () => {
		const {
			currentUserSettings: { dashboards, reports },
		} = client.readQuery({
			query: GET_PUBLIC_DASHBOARD_SETTINGS,
		});

		return { dashboards, reports };
	};

	const getCurrentDashboard = () => {
		const selectedItemId = getSelectedItemId();
		const { dashboards } = getCurrentUserSettings();

		return getDashboardById(selectedItemId, dashboards);
	};

	const getCurrentReport = () => {
		const selectedItemId = getSelectedItemId();
		const { reports } = getCurrentUserSettings();

		return getReportById(selectedItemId, reports);
	};

	const getReportTypes = () => {
		const {
			commonSettings: { reportTypes },
		} = client.readQuery({
			query: GET_USER_SETTINGS,
		});

		return { reportTypes };
	};

	return {
		getCurrentReport,
		getCurrentDashboard,
		getCurrentUserSettings,
		getPublicDashboardSettings,
		getReportTypes,
		getDefaultReportFilters,
	};
};

export default settingsApiState;
