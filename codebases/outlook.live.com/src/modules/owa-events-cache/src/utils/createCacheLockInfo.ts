import type { CacheLockInfo } from '../schema/CacheLockInfo';

export function createCacheLockInfo(): CacheLockInfo {
    return {
        lockedDateRange: null,
        lockedEvents: {},
    };
}
