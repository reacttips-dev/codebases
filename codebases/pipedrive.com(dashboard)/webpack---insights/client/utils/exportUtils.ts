import { isObject } from 'lodash';

import { TABLE_DATA_TOTAL } from './constants';

interface ExportList {
	id: number;
	totalItems: number;
	__typename?: string;
}

export const findExportList = (obj: { [key: string]: any }): ExportList => {
	const key = 'exportList';

	for (const i in obj) {
		if (obj.hasOwnProperty(i)) {
			if (i === key) {
				return obj[i];
			}

			if (Array.isArray(obj[i]) || isObject(obj[i])) {
				return findExportList(obj[i]);
			}
		}
	}

	return null;
};

export const getTotalItems = <
	T extends { total: { count: number } },
	U extends { id: string; count: number },
>(
	chartSummaryData: T,
	groupedAndSegmentedFlatData: U[],
): number => {
	if (chartSummaryData) {
		return chartSummaryData.total?.count;
	}

	return (
		groupedAndSegmentedFlatData?.find(
			(data: U) => data.id === TABLE_DATA_TOTAL,
		)?.count ?? 0
	);
};
