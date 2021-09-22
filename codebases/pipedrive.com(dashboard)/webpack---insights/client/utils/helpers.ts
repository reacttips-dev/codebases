import moment from 'moment';
import update from 'immutability-helper';
import { types as insightsTypes, periods } from '@pipedrive/insights-core';
import { ReportType } from '@pipedrive/insights-core/lib/types';

import {
	INSIGHTS_BASE_URL,
	ActivityFieldKey,
	REVENUE_ENTITY_REPORTS,
	ACTIVITY_ENTITY_REPORTS,
	ReportEntityType,
	insightsPaths,
	MAX_REPORTS_IN_DASHBOARD,
	RIGHT_ALIGNED_TABLE_CELLS,
	NAME_MAX_LENGTH,
} from './constants';
import {
	NEW_ITEM_FROM_URL_PATH,
	NEW_MODAL_FROM_URL_PATH,
	UPSELL_MODAL_FROM_URL_PATH,
} from '../pages/App/insightsWrapper/newReportFromUrl';
import {
	getQueryListPath,
	getSourceData,
	removeTypenames,
} from './responseUtils';
import {
	Dashboard,
	Report,
	SelectedItem,
	GroupByField,
	MeasureByField,
	DashboardReport,
} from '../types/apollo-query-types';
import { TranslatedField, MappedOption } from '../types/report-options';
import { MapDataReturnType } from '../types/data-layer';

export const getDashboardById = (
	dashboardId: string,
	dashboards: Dashboard[],
) => {
	return dashboards.find((dashboard) => dashboard.id === dashboardId);
};

export const getReportById = (reportId: string, reports: Report[]) => {
	if (!reportId || !reports?.length) {
		return null;
	}

	return reports.find((report) => report?.id === reportId);
};

export const removeLastChar = (str: string) => str.slice(0, -1);

export const getUrl = (type: string, id: string) => {
	return `/${INSIGHTS_BASE_URL}/${removeLastChar(type.toLowerCase())}/${id}`;
};

export const getFromUrlWithPosition = (position: number, url: string) => {
	const pathArray = url.split('/');

	return pathArray[position];
};

export const isInsightsUrl = (url: string) => {
	if (!url) {
		return false;
	}

	return url.startsWith(INSIGHTS_BASE_URL) || url.includes(INSIGHTS_BASE_URL);
};

export const splitFieldName = (field: string) => {
	const splitFilter =
		field && typeof field === 'string' ? field.split('__') : [];

	if (splitFilter.length > 1) {
		return {
			field: splitFilter[0],
			hash: splitFilter[1],
		};
	}

	return null;
};

export const isCellRightAligned = (key: string) => {
	const customField = splitFieldName(key);
	const fieldKey = customField?.field || key;

	return RIGHT_ALIGNED_TABLE_CELLS.includes(fieldKey);
};

const getSelectedItemIdFromUrl = (url: string, baseRoutePosition: number) => {
	const itemType = getFromUrlWithPosition(baseRoutePosition, url) || '';
	const itemId = getFromUrlWithPosition(baseRoutePosition + 1, url) || '';

	if (itemType !== 'goal' && itemId === NEW_ITEM_FROM_URL_PATH) {
		const newItemSpecification = getFromUrlWithPosition(
			baseRoutePosition + 2,
			url,
		);

		return newItemSpecification ? `${itemId}__${newItemSpecification}` : '';
	}

	return itemId;
};

export const selectedItemFromUrl = (
	url = window.location.pathname,
	onlyRoute = false,
): SelectedItem => {
	const itemTypes = ['dashboard', 'goal', 'report'];
	const baseRoutePosition = onlyRoute ? 0 : 3;
	const itemType = getFromUrlWithPosition(baseRoutePosition, url) || '';
	const itemId = getFromUrlWithPosition(baseRoutePosition + 1, url) || '';

	if (
		itemTypes.includes(itemType) &&
		[NEW_MODAL_FROM_URL_PATH, UPSELL_MODAL_FROM_URL_PATH].includes(itemId)
	) {
		return { id: itemId, type: itemType };
	}

	return {
		id: getSelectedItemIdFromUrl(url, baseRoutePosition),
		type: itemTypes.includes(getFromUrlWithPosition(baseRoutePosition, url))
			? `${getFromUrlWithPosition(baseRoutePosition, url)}s`
			: '',
	};
};

export const getItemFromUrl = (url: string) => {
	return {
		id: getFromUrlWithPosition(6, url) || '',
		type: `${getFromUrlWithPosition(5, url)}s`,
	};
};

export const filterReportsOutOfDashboard = (
	dashboards: Dashboard[],
	reportIds: string[],
) =>
	dashboards.filter((dashboard) =>
		update(dashboard, {
			reports: {
				$apply: (reports: DashboardReport[]) => {
					return reports.filter((dashboardReport) => {
						return !reportIds.includes(dashboardReport.id);
					});
				},
			},
		}),
	);

export const uid = () =>
	Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

export const whichDashboardContainsReport = (
	dashboards: Dashboard[],
	reportId?: string,
	reportIds?: string[],
) => {
	return dashboards.filter(
		(dashboard) =>
			dashboard.reports.filter((report: DashboardReport) =>
				reportIds
					? reportIds.includes(report.id)
					: report.id === reportId,
			).length > 0,
	);
};

export const getDashboardReports = (
	dashboard: Dashboard,
	reports: Report[],
) => {
	return reports.filter((report) => {
		return dashboard.reports.find(
			(dashboardReport) => report.id === dashboardReport.id,
		);
	});
};

export const getReportAddedToDashboardsCount = (
	reportId: string,
	dashboards: Dashboard[],
) => {
	return (
		dashboards &&
		dashboards.filter((dashboard) =>
			dashboard.reports.find(
				(dashboardReport) => reportId === dashboardReport.id,
			),
		).length
	);
};

export const getFilterRange = ({
	reportFilters,
	filterType,
}: {
	reportFilters: insightsTypes.Filter[];
	filterType: string;
}) => {
	const filter = reportFilters?.find((item) => item.filter === filterType);

	const getDate = (type: string) => {
		return (
			filter &&
			(filter.operands.find((operand) => operand.name === type) || {})
				.defaultValue
		);
	};

	const momentStartDate = moment(
		getDate(insightsTypes.OperandType.FROM),
		periods.dateFormat,
	);
	const momentEndDate = moment(
		getDate(insightsTypes.OperandType.TO),
		periods.dateFormat,
	);

	return {
		period: (filter && filter.period) || null,
		startDate: getDate(insightsTypes.OperandType.FROM) || null,
		endDate: getDate(insightsTypes.OperandType.TO) || null,
		inMonths:
			Math.ceil(momentEndDate.diff(momentStartDate, 'months', true)) ||
			null,
	};
};

export const isFutureDate = (date: moment.MomentInput): boolean =>
	moment(date).diff(moment()) > 0;

export const isPastDate = (date: moment.MomentInput): boolean =>
	moment(date).diff(moment(), 'days') < 0;

export const isReportAlreadyInDashboard = (
	dashboard: Dashboard,
	reportId: string,
) => {
	return !!dashboard.reports.find((i) => i.id === reportId);
};

export const hasMaximumAmountOfReportsInDashboard = (dashboard: Dashboard) =>
	dashboard?.reports?.length >= MAX_REPORTS_IN_DASHBOARD;

export const removeInvalidReports = (
	dashboardReports: DashboardReport[],
	reports: Report[],
): DashboardReport[] => {
	const validDashboard = update(dashboardReports, {
		$apply: (items: DashboardReport[]) => {
			return items.filter((report) => getReportById(report.id, reports));
		},
	});

	return removeTypenames(validDashboard);
};

export const addReportPropertiesToDashboardReport = (
	dashboardReports: DashboardReport[],
	reports: Report[],
): DashboardReport[] => {
	return update(dashboardReports, {
		$apply: (items: DashboardReport[]) => {
			return items.map((report) => {
				// eslint-disable-next-line camelcase
				const { report_type } = getReportById(report.id, reports);

				return {
					...report,
					report_type,
				};
			});
		},
	});
};

export const sortArrayByProperty =
	<T = any>(prop = 'name') =>
	(firstMappedOption: T, secondMappedOption: T) => {
		return (
			// @ts-ignore
			(firstMappedOption[prop].toLowerCase() >
				// @ts-ignore
				secondMappedOption[prop].toLowerCase()) -
			// @ts-ignore
			(firstMappedOption[prop].toLowerCase() <
				// @ts-ignore
				secondMappedOption[prop].toLowerCase())
		);
	};

export const mapOptions = (
	options: GroupByField[] | MeasureByField[],
	fields: TranslatedField[],
	blackList: string[] = [],
): MappedOption[] => {
	return options
		.map((option: GroupByField | MeasureByField): MappedOption => {
			const field = fields.find(
				(fieldItem) => fieldItem.uiName === option.name,
			);

			if (!field) {
				return {
					...option,
					fieldType: '',
					label: option.name,
					isCustomField: false,
					isOptionWithIntervals: false,
				};
			}

			return {
				...option,
				fieldType: field.fieldType,
				label: field.translatedName,
				isCustomField: field.isCustomField,
				isOptionWithIntervals: ['date', 'datetime'].includes(
					field.fieldType,
				),
			} as MappedOption;
		})
		.filter((option: MappedOption) => !blackList.includes(option.fieldType))
		.sort(sortArrayByProperty('label'));
};

export const filterOptionsBasedOnWhitelist = (
	options: any[],
	whitelist: string[] = [],
) => {
	return options.filter((option) => whitelist.includes(option.name));
};

export const filterOptionsBasedOnBlacklist = (
	options: any[],
	blacklist: string[] = [],
) => {
	return options.filter((option) => !blacklist.includes(option.name));
};

export const getInsightsUrlFromPath = (path: string) => {
	if (!path) {
		return null;
	}

	const matchingPath = insightsPaths.find((insightsPath) =>
		path.startsWith(insightsPath),
	);

	if (matchingPath) {
		return path.replace(matchingPath, '');
	}

	return null;
};

export const mergeFormatter = (objValue: any, srcValue: any) => {
	const allowNullForInterval =
		srcValue === null &&
		Object.values(insightsTypes.Interval).includes(objValue);

	if (allowNullForInterval) {
		return srcValue;
	}

	if (srcValue === null) {
		return objValue;
	}

	if (Array.isArray(objValue)) {
		return srcValue;
	}

	return undefined;
};

export const doesReportHaveData = (reportData: MapDataReturnType) => {
	const { groupedAndSegmentedData, uniqueSegments } = reportData;

	return (
		groupedAndSegmentedData.length > 0 ||
		uniqueSegments.length > 0 ||
		// Needed for displaying scorecard data
		groupedAndSegmentedData.score > 0
	);
};

export const doesReportTableHaveData = ({
	filterByFilter,
	data,
	dataType,
	reportType,
}: {
	filterByFilter: insightsTypes.Filter[];
	data: any;
	dataType: insightsTypes.DataType;
	reportType: ReportType;
}) => {
	const queryListPath = getQueryListPath({
		filterByFilter,
		dataType,
		reportType,
	});

	const tableData = getSourceData(queryListPath, data);

	return tableData.length > 0;
};

export const hasTypeAsSegmentInActivityReport = ({
	reportType,
	hasSegment,
	segmentByFilter,
	groupByFilter,
}: {
	reportType: insightsTypes.ReportType;
	hasSegment: boolean;
	segmentByFilter: string;
	groupByFilter: string;
}) =>
	reportType === insightsTypes.ReportType.ACTIVITIES_STATS &&
	((hasSegment && segmentByFilter === ActivityFieldKey.TYPE) ||
		(!hasSegment && groupByFilter === ActivityFieldKey.TYPE));

export const getReportEntity = (reportType: insightsTypes.ReportType) => {
	if (REVENUE_ENTITY_REPORTS.includes(reportType)) {
		return ReportEntityType.REVENUE;
	}

	if (ACTIVITY_ENTITY_REPORTS.includes(reportType)) {
		return ReportEntityType.ACTIVITY;
	}

	return ReportEntityType.DEAL;
};

export const getStagesPerPipeline = (stages: Pipedrive.Stage[]) =>
	stages.reduce((acc: any, stage: Pipedrive.Stage) => {
		if (Array.isArray(acc[stage.pipeline_id])) {
			acc[stage.pipeline_id].push(stage);
		} else {
			acc[stage.pipeline_id] = [stage];
		}

		return acc;
	}, {});

export const isNameInputValid = (value: string) =>
	value.length > 0 && value.length <= NAME_MAX_LENGTH;

export const isPublicPage = (): boolean => !!window?.app?.isPublic;

export const getShareHash = (): string =>
	window.location.href.split('share/').pop();
