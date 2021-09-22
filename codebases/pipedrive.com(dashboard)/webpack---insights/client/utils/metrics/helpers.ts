import { DataType, ReportType } from '@pipedrive/insights-core/lib/types';
import debounce from 'lodash/debounce';

import { getLogger } from '../../api/webapp';

export const wrapWithTryCatch = <A = any, R = any>(
	trackingFunction: (...args: A[]) => R,
) => {
	const callTracking = debounce(trackingFunction, 500);

	return (...params: A[]) => {
		try {
			callTracking(...params);
		} catch (err) {
			getLogger().remote(
				'error',
				`Could not track event: ${trackingFunction.name}`,
				err,
			);
		}
	};
};

// We should never send hash as link id due to security reasons
export const getSharedLinkUniqueId = (dashboardId: string, hash: string) => {
	return `${dashboardId}${hash.substring(0, 8)}`;
};

export const getReportTypeForTracking = (
	dataType: DataType,
	reportType: ReportType,
) => {
	return `${dataType}_${reportType}`;
};
