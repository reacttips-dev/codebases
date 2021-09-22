import type { ApplicationSettingsReport } from '../store/schema/ApplicationSettingsReport';
import type { ApplicationSettings } from '../store/schema/ApplicationSettings';
import type { ApplicationSettingsError } from '../store/schema/ApplicationSettingsError';

function findMissingSettings(defaultSettings, receivedSettings = {}) {
    let missingSettingsCount = 0;
    let missingSettings = [] as any;

    Object.keys(defaultSettings).forEach(key => {
        const setting = defaultSettings[key];
        const isGroup = typeof setting === 'object' && setting !== null && !Array.isArray(setting);

        if (isGroup) {
            const { count, keys } = findMissingSettings(
                defaultSettings[key],
                receivedSettings[key]
            );

            if (count) {
                missingSettingsCount += count;
                missingSettings.push({ group: key, settings: keys });
            }
        } else {
            if (!receivedSettings.hasOwnProperty(key)) {
                missingSettingsCount += 1;
                missingSettings.push(key);
            }
        }
    });

    return {
        count: missingSettingsCount,
        keys: missingSettings,
    };
}

export const generateApplicationSettingsReport = (
    defaultSettings: ApplicationSettings,
    receivedSettings: ApplicationSettings,
    lastError?: ApplicationSettingsError
): ApplicationSettingsReport | undefined => {
    const report = {} as ApplicationSettingsReport;
    let missingSettingsCount = 0;

    const { count, keys } = findMissingSettings(defaultSettings, receivedSettings);

    if (count) {
        report.MissingSettings = keys;
        missingSettingsCount = count;
    }

    if (missingSettingsCount) {
        report.MissingSettingsCount = missingSettingsCount;
    }

    if (lastError) {
        report.LastError = lastError;
    }

    if (missingSettingsCount) {
        return report;
    }

    return undefined;
};

export const getNoSettingsReport = () => ({ NoSettings: true });
