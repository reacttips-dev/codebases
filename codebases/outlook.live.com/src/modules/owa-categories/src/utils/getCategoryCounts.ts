import { getStore } from '../store/store';

export function getCategoryUnreadCount(categoryName: string) {
    const unreadCount = getStore().categoryDetails.get(categoryName)?.unreadCount;
    return unreadCount ? unreadCount : 0;
}

export function getCategoryTotalCount(categoryName: string) {
    const totalCount = getStore().categoryDetails.get(categoryName)?.totalCount;
    return totalCount ? totalCount : 0;
}
