import { action } from 'satcheljs';
import type OwaUserConfiguration from 'owa-service/lib/contract/OwaUserConfiguration';

export const userConfigurationSet = action(
    'userConfigurationSet',
    (userConfiguration: OwaUserConfiguration, userIdentity?: string) => {
        return {
            userConfiguration,
            userIdentity,
        };
    }
);
