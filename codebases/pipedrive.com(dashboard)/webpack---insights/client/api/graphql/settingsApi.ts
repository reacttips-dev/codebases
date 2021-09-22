import { gql } from '@apollo/client';

import {
	DASHBOARD_PROPS_FRAGMENT,
	REPORT_PROPS_FRAGMENT,
	REPORT_PARAMETERS_FRAGMENT,
} from '../fragments/settingsApi';

export const GET_SIDEBAR_SETTINGS = gql`
	query {
		sidebarSettings: currentUserSettings {
			dashboards {
				id
				user_id
				name
				sidemenu_position
				type
				reports {
					id
					position
				}
				shared_with {
					id
					type
					can_edit
				}
			}
			reports {
				id
				user_id
				name
				sidemenu_position
				data_type
				is_new
				contains_custom_fields
				contains_inactive_custom_fields
				report_type
				is_goals_report
				shared_with {
					id
					type
					can_edit
				}
			}
		}
	}
`;

export const GET_USER_SETTINGS = gql`
	query {
		currentUserSettings {
			dashboards {
				...DashboardProps
			}
			reports {
				...ReportProps
				parameters {
					...ReportParameters
				}
			}
			relatedObjects {
				deals {
					id
					title
				}
				organizations {
					id
					name
				}
				persons {
					id
					name
				}
				products {
					id
					name
				}
			}
		}
		commonSettings {
			reportTypes {
				name
				dataType
				type
				defaultType
				isAvailable
				subtypes {
					isAvailable
					subtype
					defaultReport {
						chart_type
						columns
						parameters {
							...ReportParameters
						}
					}
				}
			}
			reportsLimit
		}
	}
	${DASHBOARD_PROPS_FRAGMENT}
	${REPORT_PROPS_FRAGMENT}
	${REPORT_PARAMETERS_FRAGMENT}
`;

export const GET_PUBLIC_DASHBOARD_SETTINGS = gql`
	query {
		currentUserSettings: currentUserSettings {
			dashboards {
				...DashboardProps
			}
			reports {
				...ReportProps
				parameters {
					...ReportParameters
				}
			}
			relatedObjects {
				deals {
					id
					title
				}
				organizations {
					id
					name
				}
				persons {
					id
					name
				}
				products {
					id
					name
				}
			}
		}
	}
	${DASHBOARD_PROPS_FRAGMENT}
	${REPORT_PROPS_FRAGMENT}
	${REPORT_PARAMETERS_FRAGMENT}
`;

export const CREATE_DASHBOARD = gql`
	mutation CreateDashboard(
		$name: String!
		$sidemenu_position: Int!
		$reports: [dashboarddashboardReportsInput]
	) {
		createDashboard(
			dashboard: {
				name: $name
				type: "dashboard"
				sidemenu_position: $sidemenu_position
				reports: $reports
			}
		) {
			...DashboardProps
		}
	}
	${DASHBOARD_PROPS_FRAGMENT}
`;

export const RENAME_DASHBOARD = gql`
	mutation RenameDashboard($id: String!, $name: String!) {
		updateDashboard(id: $id, dashboard: { name: $name }) {
			id
			name
		}
	}
`;

export const UPDATE_DASHBOARD_REPORTS = gql`
	mutation UpdateDashboardReports(
		$id: String!
		$reports: [dashboarddashboardReportsInput]
	) {
		updateDashboard(id: $id, dashboard: { reports: $reports }) {
			id
			name
			reports {
				id
				position
			}
		}
	}
`;

export const UPDATE_DASHBOARD_SHARING = gql`
	mutation UpdateDashboardSharing(
		$id: String!
		$shared_with: [dashboardSharingOptionInput]
	) {
		updateDashboard(id: $id, dashboard: { shared_with: $shared_with }) {
			id
			shared_with {
				id
				type
				can_edit
			}
		}
	}
`;

export const DELETE_DASHBOARD = gql`
	mutation DeleteDashboard($id: String!) {
		deleteDashboard(id: $id)
	}
`;

export const CREATE_REPORT = gql`
	mutation CreateReport($report: reportreportInput!) {
		createReport(report: $report) {
			...ReportProps
			parameters {
				...ReportParameters
			}
		}
	}
	${REPORT_PROPS_FRAGMENT}
	${REPORT_PARAMETERS_FRAGMENT}
`;

export const DELETE_REPORT = gql`
	mutation DeleteReport($id: String!) {
		deleteReport(id: $id)
	}
`;

export const DELETE_REPORTS = gql`
	mutation DeleteReports($ids: [String!]) {
		deleteReports(ids: $ids)
	}
`;

export const UPDATE_REPORT = gql`
	mutation UpdateReport($id: String!, $report: reportreportInput!) {
		updateReport(id: $id, report: $report) {
			id
			name
			chart_type
			data_type
			report_type
			columns
			sidemenu_position
			is_new
			contains_custom_fields
			contains_inactive_custom_fields
			__typename
			parameters {
				...ReportParameters
			}
		}
	}
	${REPORT_PARAMETERS_FRAGMENT}
`;

export const UPDATE_REPORT_COLUMNS = gql`
	mutation UpdateReportColumns($id: String!, $columns: [String]!) {
		updateReport(id: $id, report: { columns: $columns }) {
			id
			columns
		}
	}
`;

export const RENAME_REPORT = gql`
	mutation UpdateReportColumns($id: String!, $name: String!) {
		updateReport(id: $id, report: { name: $name }) {
			id
			name
		}
	}
`;

export const BULK_UPDATE_DASHBOARDS = gql`
	mutation BulkUpdateDashboards($dashboards: [dashboarddashboardInput]) {
		bulk(action: update, documents: { dashboards: $dashboards }) {
			dashboards {
				id
				sidemenu_position
			}
		}
	}
`;

export const BULK_UPDATE_REPORTS = gql`
	mutation BulkUpdateReports($reports: [reportreportInput]) {
		bulk(action: update, documents: { reports: $reports }) {
			reports {
				id
				report_type
				sidemenu_position
				parameters {
					...ReportParameters
				}
			}
		}
	}
	${REPORT_PARAMETERS_FRAGMENT}
`;

export const CREATE_PUBLIC_LINK = gql`
	mutation CreatePublicLink($dashboardId: String!) {
		createPublicLink(dashboardId: $dashboardId) {
			id
			name
			__typename
		}
	}
`;

export const DELETE_PUBLIC_LINK = gql`
	mutation DeletePublicLink($id: String!) {
		deletePublicLink(id: $id)
	}
`;

export const GET_PUBLIC_LINKS = gql`
	query GetPublicLinks($dashboardId: String!) {
		publicLinks(dashboardId: $dashboardId) {
			data {
				id
				name
				__typename
			}
		}
	}
`;

export const UPDATE_PUBLIC_LINK = gql`
	mutation UpdatePublicLink(
		$id: String!
		$publicLink: publicLinkpublicLinkInput!
	) {
		updatePublicLink(id: $id, publicLink: $publicLink) {
			id
			name
		}
	}
`;

export const UPDATE_QUICK_FILTERS = gql`
	mutation UpdateQuickFilters(
		$id: String!
		$quick_filters: dashboarddashboardQuick_filtersInput
	) {
		updateQuickFilters(id: $id, quick_filters: $quick_filters) {
			id
			quick_filters {
				user_id
				period
				user
			}
		}
	}
`;
