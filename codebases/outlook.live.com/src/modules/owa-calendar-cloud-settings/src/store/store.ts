import type CalendarCloudSetting from './schema/CalendarCloudSetting';
import type CalendarCloudSettingsStore from './schema/CalendarCloudSettingsStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const defaultStore: CalendarCloudSettingsStore = {
    settings: new ObservableMap<string, CalendarCloudSetting>(),
};

export const getStore = createStore('CalendarCloudSettings', defaultStore);
