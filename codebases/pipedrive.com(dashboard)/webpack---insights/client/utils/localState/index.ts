import { InsightsApiClient } from '../../api/apollo/insightsApiClient';
import { SettingsApiClient } from '../../api/apollo/settingsApiClient';
import insightsApiState from './insightsApiState';
import settingsApiState from './settingsApiState';

const localState = () => {
	return {
		...insightsApiState(InsightsApiClient, SettingsApiClient),
		...settingsApiState(SettingsApiClient),
	};
};

export default localState;
