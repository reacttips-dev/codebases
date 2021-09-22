import { createStore } from 'satcheljs';

import type ApplicationSettingsStore from './schema/ApplicationSettingsStore';

import { defaultApplicationSettings } from './applicationSettingsDefinitions';

import { getLocalOverrides } from '../utils/localOverrides';

let applicationSettingsStore: ApplicationSettingsStore = {
    settings: defaultApplicationSettings,
    overrides: getLocalOverrides(),
    configIDs: undefined,
    lastError: undefined,
    initialized: false,
    report: undefined,
    searchKey: undefined,
};

export default createStore<ApplicationSettingsStore>(
    'applicationSettings',
    applicationSettingsStore
);
