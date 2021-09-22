import { getEnabledFlightsWithPrefix } from 'owa-feature-flags';

const addinsFeatureFlagsPrefix = 'addin';

export default function getEnabledAddinsFeatureFlags(): string[] {
    return getEnabledFlightsWithPrefix(addinsFeatureFlagsPrefix).sort();
}
