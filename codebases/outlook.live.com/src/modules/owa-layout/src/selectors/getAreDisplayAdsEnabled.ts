import { getStore } from '../store/store';

export function getAreDisplayAdsEnabled(): boolean {
    return getStore().areDisplayAdsEnabled;
}
