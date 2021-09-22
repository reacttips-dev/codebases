import { getItem, itemExists, localStorageExists } from 'owa-local-storage';
import { USER_OCPS_OUTLOOK_RECOMMENDATION_ENABLED } from '../utils/constants';
import fetchPoliciesAndSetStore from './fetchPoliciesAndSetStore';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isFeatureEnabled } from 'owa-feature-flags';

export default async function isOutlookRecommendationEnabled(): Promise<boolean> {
    if (isConsumer() || !isFeatureEnabled('ocps-policy-check')) {
        return true;
    }

    if (localStorageExists(window)) {
        await fetchPoliciesAndSetStore();

        if (itemExists(window, USER_OCPS_OUTLOOK_RECOMMENDATION_ENABLED)) {
            return getItem(window, USER_OCPS_OUTLOOK_RECOMMENDATION_ENABLED) == '1';
        }
    }

    return true;
}
