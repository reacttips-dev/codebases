import { isFeatureEnabled } from 'owa-feature-flags';

const LOW_TIMEOUT = 100;
const MED_TIMEOUT = 250;
const HIGH_TIMEOUT = 500;
const DEFAULT_TIMEOUT = 1000;

export function getServiceTimeout(): number {
    return isFeatureEnabled('rp-peopleTrieOnTimeoutLow')
        ? LOW_TIMEOUT
        : isFeatureEnabled('rp-peopleTrieOnTimeoutMed')
        ? MED_TIMEOUT
        : isFeatureEnabled('rp-peopleTrieOnTimeoutHigh')
        ? HIGH_TIMEOUT
        : DEFAULT_TIMEOUT;
}
