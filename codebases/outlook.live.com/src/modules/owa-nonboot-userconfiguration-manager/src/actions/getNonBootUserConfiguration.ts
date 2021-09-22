import type OwaNonBootUserConfiguration from 'owa-service/lib/contract/OwaNonBootUserConfiguration';
import getOwaNonBootUserConfigurationOperation from 'owa-service/lib/operation/getOwaNonBootUserConfigurationOperation';
import store from '../store/store';
import { mutatorAction } from 'satcheljs';
import { isAnonymousUser } from 'owa-config/lib/anonymousUtils';

let requestPromise: Promise<OwaNonBootUserConfiguration> | undefined;

let setNonBootUserConfiguration = mutatorAction(
    'setNonBootUserConfiguration',
    function (userConfig: OwaNonBootUserConfiguration) {
        store.nonBootUserConfiguration = userConfig;
    }
);

function getNonBootUserConfiguration(): Promise<OwaNonBootUserConfiguration> {
    if (isAnonymousUser()) {
        return Promise.resolve({});
    } else if (store.nonBootUserConfiguration) {
        return Promise.resolve(store.nonBootUserConfiguration);
    } else if (!requestPromise) {
        requestPromise = getOwaNonBootUserConfigurationOperation()
            .then(userConfig => {
                setNonBootUserConfiguration(userConfig);
                return userConfig;
            })
            .catch(err => {
                requestPromise = undefined;
                throw err;
            });
    }

    return requestPromise;
}

export default getNonBootUserConfiguration;

export function getNonBootUserConfigurationSync(): OwaNonBootUserConfiguration | null {
    if (!store.nonBootUserConfiguration) {
        // Kick off the request so the store will get updated
        getNonBootUserConfiguration();
    }

    return store.nonBootUserConfiguration;
}
