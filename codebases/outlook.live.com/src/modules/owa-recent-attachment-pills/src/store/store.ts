import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { RecentAttachmentPillsStore } from './schema/RecentAttachmentPillsStore';
import type { RecentAttachmentsPillsData } from './schema/RecentAttachmentsPillsData';

const defaultStore: RecentAttachmentPillsStore = {
    recentAttachmentPills: new ObservableMap<string, RecentAttachmentsPillsData>({}),
};

export const getStore = createStore('recentAttachmentPills', defaultStore);
