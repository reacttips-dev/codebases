import getStore from '../store/Store';

export function getEnabledFlightsWithPrefix(prefix: string): string[] {
    const featureFlags = getStore().featureFlags;
    return [...featureFlags.keys()].filter(
        f => f.indexOf(prefix) == 0 && featureFlags.get(f.toLowerCase())
    );
}
