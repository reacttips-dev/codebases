import { types as insightsTypes } from '@pipedrive/insights-core';

import { PERMISSION_TYPES } from '../utils/constants';
import {
	arePlatinumFeaturesEnabled,
	getCompanyTierCode,
	isAdmin,
	isRecurringRevenueEnabled,
	isRecurringRevenueGrowthEnabled,
} from '../api/webapp/index';
import { Report } from '../types/apollo-query-types';

const getPermissionToSeeThisDashboard = (index: number) => index === 0;

const isAnyRevenueReportsDisabled = (
	report: Partial<Report>,
	hasPermission: boolean,
) => {
	const isRecurringRevenueReportDisabled =
		report.report_type ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE &&
		!isRecurringRevenueEnabled();

	const isRevenueMovementReportDisabled =
		report.report_type ===
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT &&
		!isRecurringRevenueGrowthEnabled();
	const isRevenueForecastReportDisabled =
		report.report_type ===
			insightsTypes.ReportType.DEALS_REVENUE_FORECAST && !hasPermission;

	return (
		isRecurringRevenueReportDisabled ||
		isRevenueMovementReportDisabled ||
		isRevenueForecastReportDisabled
	);
};

const PLATINUM_TIER = 'platinum';

const {
	static: { haveMultipleDashboards, useRevenueReport },
	dynamic: { seeThisDashboard, seeThisReport },
} = PERMISSION_TYPES;

const rules = {
	diamond: {
		static: [haveMultipleDashboards, useRevenueReport],
		dynamic: {
			[seeThisDashboard]: () => true,
			[seeThisReport]: () => true,
		},
	},
	platinum: {
		static: [haveMultipleDashboards, useRevenueReport],
		dynamic: {
			[seeThisDashboard]: () => true,
			[seeThisReport]: () => true,
		},
	},
	gold: {
		static: [],
		dynamic: {
			[seeThisDashboard]: getPermissionToSeeThisDashboard,
			[seeThisReport]: (containsCustomFields: boolean) =>
				!containsCustomFields,
		},
	},
	silver: {
		static: [],
		dynamic: {
			[seeThisDashboard]: getPermissionToSeeThisDashboard,
			[seeThisReport]: (containsCustomFields: boolean) =>
				!containsCustomFields,
		},
	},
} as {
	[key: string]: {
		static: string[];
		dynamic: { [key: string]: (containsCustomFields: boolean) => boolean };
	};
};

export default () => {
	const currentCompanyPlan = arePlatinumFeaturesEnabled()
		? PLATINUM_TIER
		: getCompanyTierCode();

	const hasPermission = (action: string, data?: any) => {
		const permissions = rules[currentCompanyPlan];

		if (!permissions) {
			return false;
		}

		const staticPermissions = permissions.static;

		if ((staticPermissions || []).includes(action)) {
			return true;
		}

		const dynamicPermissions = permissions.dynamic;

		if (dynamicPermissions) {
			const permissionCondition = dynamicPermissions[action];

			if (!permissionCondition) {
				return false;
			}

			return permissionCondition(data);
		}

		return false;
	};

	const canSeeReport = (report: Partial<Report>) => {
		if (
			isAnyRevenueReportsDisabled(
				report,
				hasPermission(PERMISSION_TYPES.static.useRevenueReport),
			)
		) {
			return false;
		}

		if (
			hasPermission(
				PERMISSION_TYPES.dynamic.seeThisReport,
				report.contains_custom_fields,
			)
		) {
			return true;
		}

		return false;
	};

	const getCurrentCompanyPlan = () => {
		switch (currentCompanyPlan) {
			case 'silver':
				return 'Essential';
			case 'gold':
				return 'Advanced';
			case 'platinum':
				return 'Professional';
			default:
				return 'Enterprise';
		}
	};

	return {
		hasPermission,
		isAdmin: isAdmin(),
		canSeeReport,
		getCurrentCompanyPlan,
	};
};
