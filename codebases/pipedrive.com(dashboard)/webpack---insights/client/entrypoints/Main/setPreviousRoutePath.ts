import { trackingParamsVar } from '../../api/vars/settingsApi';
import { isInsightsUrl } from '../../utils/helpers';
import { ENTRYPOINT_PROPERTIES } from '../../utils/metrics/analytics-properties';

const setPreviousRoutePath = (routePath: string) => {
	const isInsightsPage = isInsightsUrl(routePath);

	if (isInsightsPage || !routePath) {
		return;
	}

	const getEntryPointValue = () => {
		if (routePath.includes('progress/reports')) {
			return ENTRYPOINT_PROPERTIES.oldReport;
		}

		if (routePath.includes('progress/dashboard')) {
			return ENTRYPOINT_PROPERTIES.oldDashboard;
		}

		if (routePath.includes('deals')) {
			return ENTRYPOINT_PROPERTIES.dealsList;
		}

		return routePath.substring(1);
	};

	trackingParamsVar({
		source: '',
		entryPoint: getEntryPointValue(),
	});
};

export default setPreviousRoutePath;
