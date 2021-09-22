import { action } from 'satcheljs';

import type { ApplicationSettingsConfig } from '../store/schema/ApplicationSettingsConfig';

const INITIALIZE_APPLICATION_SETTINGS_ACTION_NAME = 'initializeApplicationSettings';

const initializeApplicationSettings = action(
    INITIALIZE_APPLICATION_SETTINGS_ACTION_NAME,
    (configFromService?: ApplicationSettingsConfig) => ({ config: configFromService })
);

export default initializeApplicationSettings;
