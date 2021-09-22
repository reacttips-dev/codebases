import { getCompanyFeatures, getCurrentUserId } from '../../api/webapp';
import { Report } from '../../types/apollo-query-types';
import { Goal } from '../../types/goals';
import { getOwnItems } from '../../utils/sharingUtils';
import { CAPPING_WARNING_CUTOFF_VALUE, getMaxLimit } from './cappingConstants';

export interface ReportsLimitReturnData {
	numberOfReports: number;
	hasReachedReportsLimit: boolean;
	isNearReportsLimit: boolean;
	limitAsString: string;
	limit: number;
}

export const getReportsOfReportType = (reports: (Report | Goal)[]) => {
	const ownReports = getOwnItems(reports, getCurrentUserId());

	return ownReports.filter((report: Report) => !report?.is_goals_report);
};

export const showCappingFeatures = (forceWarning: boolean) => {
	if (forceWarning) {
		return true;
	}

	return getCompanyFeatures()?.reports_usage_capping;
};

const getLimit = (limit: number) => {
	const isDiamondTierOrNotOnCappingFeature =
		limit === -1 || !showCappingFeatures(false);

	return isDiamondTierOrNotOnCappingFeature ? getMaxLimit() : limit;
};

export const percentageOfLimit = (numberOfItems: number, limit: number) =>
	limit ? Number(((numberOfItems * 100) / limit).toFixed(0)) : 0;

export const percentageOfLimitAsString = (
	numberOfItems: number,
	limit: number,
) => `${percentageOfLimit(numberOfItems, getLimit(limit))}%`;

export const hasReachedEightyPercentLimit = (
	numberOfItems: number,
	limit: number,
) =>
	percentageOfLimit(numberOfItems, getLimit(limit)) >=
	CAPPING_WARNING_CUTOFF_VALUE;

const hasReachedReportsLimit = (numberOfReports: number, limit: number) => {
	if (showCappingFeatures(false)) {
		const limitForTier = getLimit(limit);

		return numberOfReports >= limitForTier;
	}

	return numberOfReports >= getMaxLimit();
};

export const getReportsLimitData = (
	reports: Report[],
	limit: number,
): ReportsLimitReturnData => {
	const numberOfReports = getReportsOfReportType(reports)?.length;

	return {
		numberOfReports,
		hasReachedReportsLimit: hasReachedReportsLimit(numberOfReports, limit),
		limit: getLimit(limit),
		isNearReportsLimit: hasReachedEightyPercentLimit(
			numberOfReports,
			limit,
		),
		limitAsString: percentageOfLimitAsString(numberOfReports, limit),
	};
};

export interface MappingOptions {
	custom_fields: number;
	deals: number;
	reports: number;
}

export interface CapMappingEndpointReturn {
	nextTier: string;
	cappingKey: keyof MappingOptions;
	mapping: {
		[key: string]: MappingOptions;
	};
}

export const getNextTierLimit = ({
	nextTier,
	cappingKey,
	mapping,
}: CapMappingEndpointReturn) => {
	const nextTierLimits = mapping?.[nextTier];

	return nextTierLimits?.[cappingKey];
};
