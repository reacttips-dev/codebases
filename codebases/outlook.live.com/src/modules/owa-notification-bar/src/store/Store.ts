import type NotificationBarData from './schema/NotificationBarData';
import type NotificationBarStore from './schema/NotificationBarStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

let defaultStore: NotificationBarStore = {
    notificationsMap: new ObservableMap<string, NotificationBarData>(),
    notificationStack: [],
    notificationBarViewState: {
        isHovered: false,
        autoDismissTimerCompleted: false,
        isFocused: false,
    },
};

var store = createStore<NotificationBarStore>('NotificationBarStore', defaultStore)();

export default store;
