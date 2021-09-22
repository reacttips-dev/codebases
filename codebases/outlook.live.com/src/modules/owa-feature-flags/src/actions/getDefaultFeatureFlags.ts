import { getDefaultFlags } from '../utils/defaultFlags';

export function getDefaultFeatureFlags() {
    return Object.keys(getDefaultFlags());
}
