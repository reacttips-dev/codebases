import { getPrimaryAndConnectedAccountsEmailAddresses } from 'owa-session-store';
import {
    workloadScenarioSettingsLoaded,
    loadingWorkloadScenarioSettingsFailed,
} from '../actions/publicActions';
import { getWorkloadScenarioSettings } from '../services/getWorkloadScenarioSettingsService';
import { createRetriableFunction, createExponentialBackoffFunction } from 'owa-retriable-function';
import type { Settings } from '../schema/ScenarioSettings';

const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});

const requests: {
    [account: string]: { retriableFunc: () => Promise<Settings>; cancel: () => void };
} = {};

export async function loadWorkloadScenarioSettings() {
    const loadPromises = getPrimaryAndConnectedAccountsEmailAddresses().map(loadSettings);
    await Promise.all(loadPromises);
}

export async function loadSettings(userIdentity: string) {
    let settings: Settings;
    try {
        // if a request has already been made to get settings in the current session, stop processing
        if (requests[userIdentity]) {
            return;
        }
        requests[userIdentity] = createRetriableFunc(() =>
            getWorkloadScenarioSettings(userIdentity)
        );
        settings = await requests[userIdentity].retriableFunc();
        workloadScenarioSettingsLoaded(settings, userIdentity);
    } catch {
        loadingWorkloadScenarioSettingsFailed(userIdentity);
    }
}
