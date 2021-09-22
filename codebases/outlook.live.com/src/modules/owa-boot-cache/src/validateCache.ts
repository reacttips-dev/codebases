import validateCacheRequest from 'owa-service/lib/factory/validateAggregatedConfigurationRequest';
import validateCacheOperation from 'owa-service/lib/operation/validateAggregatedConfigurationOperation';
import { isAnonymousUser } from 'owa-config/lib/anonymousUtils';

// only validate once per session
let hasValidated = false;

export default function validateCache() {
    if (!hasValidated && !isAnonymousUser()) {
        validateCacheOperation(validateCacheRequest({}));
        hasValidated = true;
    }
}
