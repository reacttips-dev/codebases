import { orchestrator } from 'satcheljs';
import { loadSettings } from '../utils/loadWorkloadScenarioSettings';
import { owaConnectedAccountAdded } from 'owa-account-store-init';

/**
 * When an account is initialized, load the workload settings for this account
 */
export const owaAccountAddedOrchestrator = orchestrator(owaConnectedAccountAdded, actionMessage => {
    const { userIdentity } = actionMessage;
    loadSettings(userIdentity);
});
