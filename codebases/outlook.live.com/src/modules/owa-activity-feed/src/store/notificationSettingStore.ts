import { createStore } from 'satcheljs';
import { ActivityFeedSettingIds } from '../service/ActivityFeedSettingType';
import { ObservableMap } from 'mobx';

export const getActivityFeedSettingsStore = createStore<
    ObservableMap<ActivityFeedSettingIds, boolean>
>(
    'activityFeedSettingsStore',
    new ObservableMap<ActivityFeedSettingIds, boolean>(
        Object.keys(ActivityFeedSettingIds)
            .filter(key => !isNaN(Number(ActivityFeedSettingIds[key])))
            .map<[ActivityFeedSettingIds, boolean]>(key => [ActivityFeedSettingIds[key], true])
    )
);
