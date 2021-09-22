import { isFeatureEnabled } from 'owa-feature-flags';

const CACHE_SIZE_300 = 300;
const CACHE_SIZE_500 = 500;
const CACHE_SIZE_700 = 700;

export function getCacheContactsCount(): number {
    return isFeatureEnabled('rp-cacheFirstPeopleTrieSize300')
        ? CACHE_SIZE_300
        : isFeatureEnabled('rp-cacheFirstPeopleTrieSize700')
        ? CACHE_SIZE_700
        : CACHE_SIZE_500;
}
