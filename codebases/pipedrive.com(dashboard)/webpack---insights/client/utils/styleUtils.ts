import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { CHART_COLORS, GROUPING_COLOR, ReportEntityType } from './constants';
import { getReportEntity, isPublicPage } from './helpers';
import { isActivityGoal } from '../molecules/GoalDetailsModal/goalDetailsModalUtils';

export const renameKeys = (keysMap: any, obj: any) =>
	Object.keys(obj).reduce(
		(acc, key) => ({
			...acc,
			...{ [keysMap[key] || key]: obj[key] },
		}),
		{},
	);

export const getReportTypeWidgetMinSizes = (
	reportType: insightsTypes.ReportType,
) => {
	if (reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION) {
		return {
			minW: 2,
		};
	}

	return {};
};

export const generateLayout = (uniqueId: string, item: any) => {
	if (Object.keys(item).length === 0 || item.type !== 'dashboard') {
		return [];
	}

	const keysMap = {
		0: 'x',
		1: 'y',
		2: 'w',
		3: 'h',
	};

	return item.reports
		.map((report: any) => ({
			...renameKeys(keysMap, report.position),
			i: report.id.toString(),
			...(report.id === uniqueId && {
				static: true,
			}),
			minH: 5, // 5*60
			...getReportTypeWidgetMinSizes(report.report_type),
		}))
		.sort((a: any, b: any) => b.y - a.y);
};

export const getReportIcon = ({
	reportType,
	item,
	getActivityTypeById,
}: {
	reportType: insightsTypes.ReportType;
	item?: any;
	getActivityTypeById?: (id: number) => Pipedrive.ActivityType | undefined;
}) => {
	const activityTypeId = item?.type?.params?.activity_type_id;

	if (
		isActivityGoal(item?.type?.name) &&
		getActivityTypeById &&
		activityTypeId
	) {
		const activityType = getActivityTypeById(activityTypeId);

		return activityType ? `ac-${activityType?.icon_key}` : 'calendar';
	}

	const reportEntity = getReportEntity(reportType);

	if (reportEntity === ReportEntityType.ACTIVITY) {
		return 'calendar';
	}

	if (reportEntity === ReportEntityType.REVENUE) {
		return 'revenue-recurring';
	}

	return 'deal';
};

export const getColor = (
	name: string,
	index = 0,
	shouldUseMultipleColors = false,
) => {
	const segmentCode = typeof name === 'string' ? name.toLowerCase() : name;

	switch (segmentCode) {
		case 'won':
			return colors['$color-lime-hex'];
		case 'lost':
			return colors['$color-salmon-hex'];
		case 'open':
			return colors['$color-turquoise-hex'];
		default:
			return shouldUseMultipleColors
				? CHART_COLORS[index % CHART_COLORS.length]
				: GROUPING_COLOR;
	}
};

export const getWidgetPositionOnDashboard = (
	chartType: insightsTypes.ChartType,
) => {
	if (chartType === insightsTypes.ChartType.PIE) {
		return [0, 0, 1, 6];
	}

	if (chartType === insightsTypes.ChartType.SCORECARD) {
		return [0, 0, 1, 5];
	}

	return [0, 0, 2, 6];
};

export const getCursor = (): string => (isPublicPage() ? 'default' : 'pointer');
