import { getActivityFeedStore } from './store';

export const getUnseenItemsCount = () => {
    if (getActivityFeedStore().isActivityFeedOpen) {
        return 0;
    }
    return [...getActivityFeedStore().items.values()].filter(item => !item.isSeen).length;
};
