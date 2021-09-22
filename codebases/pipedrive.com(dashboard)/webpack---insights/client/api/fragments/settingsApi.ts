import { gql } from '@apollo/client';

export const DASHBOARD_PROPS_FRAGMENT = gql`
	fragment DashboardProps on dashboarddashboard {
		id
		user_id
		name
		type
		sidemenu_position
		reports {
			id
			position
			__typename
		}
		quick_filters {
			user_id
			period
			user
		}
		shared_with {
			id
			type
			can_edit
		}
		__typename
	}
`;

export const REPORT_PROPS_FRAGMENT = gql`
	fragment ReportProps on reportreport {
		id
		user_id
		name
		chart_type
		data_type
		report_type
		columns
		sidemenu_position
		is_new
		contains_custom_fields
		contains_inactive_custom_fields
		is_goals_report
		shared_with {
			id
			type
			can_edit
		}
		__typename
	}
`;

export const REPORT_PARAMETERS_FRAGMENT = gql`
	fragment ReportParameters on reportreportParameters {
		filter_by
		group_by
		measure_by
		stages
		segment_by
		stats
		is_cumulative
		__typename
	}
`;
