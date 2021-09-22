import {
    OUTLOOK_DESKTOP,
    MAC_OUTLOOK,
    IOS_OUTLOOK,
    ANDROID_OUTLOOK,
    NATIVE,
    TEAMS,
    O365_SHELL,
    WIDGET,
    getOpxHostApp,
    WIN32_OUTLOOK_HUB,
    TEAMS_HUB,
    HUB,
} from 'owa-config';
import { getFlagDefaults } from './flagsDefaults';
import { isNative } from './utils/isNative';
import { isHostedInTeams } from 'owa-opx';
import { getCurrentHostHub } from 'owa-metaos-utils';

export const isHostAppFeatureEnabled = (flagName: string): boolean => {
    const featureFlag = getFlagDefaults(flagName);

    if (featureFlag) {
        if (isNative() && NATIVE in featureFlag) {
            return featureFlag[NATIVE];
        }
        if (isHostedInTeams() && TEAMS in featureFlag) {
            return featureFlag[TEAMS];
        }

        let hostHub = getCurrentHostHub();
        if (hostHub && hostHub in featureFlag) {
            return featureFlag[hostHub];
        }
        if (
            hostHub &&
            (hostHub === TEAMS_HUB || hostHub === WIN32_OUTLOOK_HUB) &&
            HUB in featureFlag
        ) {
            return featureFlag[HUB];
        }

        const hostApp = getOpxHostApp();
        if (hostApp && hostApp in featureFlag) {
            return featureFlag[hostApp];
        }
        if (
            hostApp &&
            (hostApp === OUTLOOK_DESKTOP ||
                hostApp === MAC_OUTLOOK ||
                hostApp === IOS_OUTLOOK ||
                hostApp === ANDROID_OUTLOOK ||
                hostApp === TEAMS ||
                hostApp === O365_SHELL ||
                hostApp === WIDGET) &&
            'opx' in featureFlag
        ) {
            return featureFlag['opx'];
        }

        return featureFlag['default'];
    }

    return false;
};
