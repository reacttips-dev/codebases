import getStore from '../store/store';

export function getIsAllCalendarAccountsAndCacheLoaded(): boolean {
    return getStore().isAllCalendarAccountsAndCacheLoaded;
}
