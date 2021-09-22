import { trackReportOpened } from '../../utils/metrics/report-analytics';
import { trackGoalOpened } from '../../utils/metrics/goal-analytics';
import { SelectedItem, SelectedItemType } from '../../types/apollo-query-types';
import { GET_USER_SETTINGS } from '../../api/graphql';
import { trackingParamsVar } from '../../api/vars/settingsApi';
import { SettingsApiClient } from '../../api/apollo/settingsApiClient';

export const trackPageOpenedEvent = async ({ id, type }: SelectedItem) => {
	if (type === SelectedItemType.REPORTS) {
		const trackingParams = trackingParamsVar();
		const {
			currentUserSettings: { reports, dashboards },
		} = await SettingsApiClient.readQuery({
			query: GET_USER_SETTINGS,
		});

		const { source, entryPoint } = trackingParams;

		trackReportOpened({
			reportId: id,
			source,
			entryPoint,
			reports,
			dashboards,
		});
	}

	if (type === SelectedItemType.GOALS) {
		trackGoalOpened(id);
	}
};
