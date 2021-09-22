import { createStore } from 'satcheljs';
import type { ActivityFeedItem } from '../service/ActivityFeedItem';
import { ObservableMap } from 'mobx';

export interface ActivityFeedStore {
    firstFetchComplete: boolean;
    isActivityFeedOpen: boolean;
    isActivityFeedSettingOpen: boolean;
    items: ObservableMap<string, ActivityFeedItem>;
}

export const getActivityFeedStore = createStore<ActivityFeedStore>('activityFeedStore', {
    firstFetchComplete: false,
    isActivityFeedOpen: false,
    items: new ObservableMap<string, ActivityFeedItem>(),
    isActivityFeedSettingOpen: false,
});
