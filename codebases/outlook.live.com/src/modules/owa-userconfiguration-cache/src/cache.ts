import type OwaUserConfiguration from 'owa-service/lib/contract/OwaUserConfiguration';
import { UserConfiguration, DEFAULT_USER_CONFIG } from 'owa-graph-schema';
import * as trace from 'owa-trace';

import { convertUserConfigToGraphQLSchema } from './utils/convertUserConfigToGraphQLSchema';

const cache = new Map<string, UserConfiguration>();

export function setConfiguration(
    configuration: OwaUserConfiguration | undefined,
    userConfigurationId: string
) {
    try {
        if (configuration) {
            const configCopy = JSON.parse(JSON.stringify(configuration));
            const config = convertUserConfigToGraphQLSchema(configCopy, userConfigurationId);
            cache[userConfigurationId] = config;
        }
    } catch (e) {
        trace.errorThatWillCauseAlert('User configuration cache set failed: ' + e);
    }
}

export function getConfiguration(userConfigurationId?: string | null): UserConfiguration {
    let userConfigurationIdToUse = userConfigurationId || DEFAULT_USER_CONFIG;
    return cache[userConfigurationIdToUse] || { id: userConfigurationIdToUse };
}

export function updateConfiguration(
    configName: string,
    key: string,
    value: any,
    userConfigurationId?: string | undefined
) {
    const userConfigurationIdToUse = userConfigurationId || DEFAULT_USER_CONFIG;
    if (!cache[userConfigurationIdToUse]) {
        trace.errorThatWillCauseAlert(
            `Attempt to set ${configName}.${key} User Config setting before they are initialized for userConfiguration entry `
        );
        return;
    }

    cache[userConfigurationIdToUse][configName][key] = value;
}
