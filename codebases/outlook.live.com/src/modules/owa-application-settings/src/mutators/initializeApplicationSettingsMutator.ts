import { mutator } from 'satcheljs';

import initializeApplicationSettingsAction from '../actions/initializeApplicationSettingsAction';
import { defaultApplicationSettings } from '../store/applicationSettingsDefinitions';
import type { ApplicationSettings } from '../store/schema/ApplicationSettings';
import getStore from '../store/store';
import {
    generateApplicationSettingsReport,
    getNoSettingsReport,
} from '../utils/generateApplicationSettingsReport';

const initializeApplicationSettingsMutator = mutator(
    initializeApplicationSettingsAction,
    ({ config }) => {
        const store = getStore();
        store.initialized = true;

        if (!config) {
            store.report = getNoSettingsReport();
            return;
        }

        if (!config.settings) {
            store.lastError = config.lastError;
            store.report = getNoSettingsReport();
            return;
        }

        const mergedSettings = {};

        const defaultGroups = Object.keys(defaultApplicationSettings);

        defaultGroups.forEach(group => {
            mergedSettings[group] = {};
            const receivedGroup = config.settings[group];

            const defaultSettingKeys = Object.keys(defaultApplicationSettings[group]);

            defaultSettingKeys.forEach(setting => {
                mergedSettings[group][setting] =
                    receivedGroup && receivedGroup.hasOwnProperty(setting)
                        ? receivedGroup[setting]
                        : defaultApplicationSettings[group][setting];
            });
        });

        store.configIDs = config.configIDs;
        store.lastError = config.lastError;
        store.settings = mergedSettings as ApplicationSettings;
        store.report = generateApplicationSettingsReport(
            defaultApplicationSettings,
            config.settings,
            config.lastError
        );
    }
);

export default initializeApplicationSettingsMutator;
