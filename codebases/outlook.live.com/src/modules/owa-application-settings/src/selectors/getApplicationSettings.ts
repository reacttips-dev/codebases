import * as trace from 'owa-trace';
import { isFeatureEnabled } from 'owa-feature-flags';
import getStore from '../store/store';

import type {
    ApplicationSettings,
    ApplicationSettingGroup,
} from '../store/schema/ApplicationSettings';

function updateSettingsWithOverrides(settings, overrides, path) {
    let result = {};

    Object.keys(settings).forEach(setting => {
        const isGroup = typeof setting === 'object' && setting !== null && !Array.isArray(setting);

        if (isGroup) {
            result = {
                ...result,
                [path.shift()]: updateSettingsWithOverrides(settings[setting], overrides, path),
            };
        } else {
            const settingPath = [...path, setting].join('.');
            const override = overrides[settingPath];
            result = {
                ...result,
                [setting]: override === undefined ? settings[setting] : override,
            };
        }
    });

    return result;
}

export default function getApplicationSettings<TGroup extends ApplicationSettingGroup>(
    group: TGroup
): ApplicationSettings[TGroup] {
    const store = getStore();

    if (!store.initialized && !process.env.JEST_WORKER_ID) {
        trace.errorThatWillCauseAlert(
            `Attempted to read ${group} before application settings were initialized.`
        );
    }

    if (isFeatureEnabled('fwk-devTools')) {
        return updateSettingsWithOverrides(store.settings[group], store.overrides, [group]) as any;
    }

    return store.settings[group];
}
