import type { FeatureName } from '../store/featureDefinitions';
import isFeatureEnabled from './isFeatureEnabled';
import type { LogicalRing } from 'owa-config';

export default function calculateLogicalRing(
    lookupFunction: (feature: FeatureName) => boolean = isFeatureEnabled
): LogicalRing {
    if (lookupFunction('ring-dogfood')) {
        return 'Dogfood';
    } else if (lookupFunction('ring-microsoft')) {
        return 'Microsoft';
    } else if (lookupFunction('ring-firstrelease')) {
        return 'FirstRelease';
    } else if (lookupFunction('ring-ww')) {
        return 'WW';
    }
    return 'Unknown';
}
