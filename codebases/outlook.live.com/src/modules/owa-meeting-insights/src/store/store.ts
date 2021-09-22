import type InsightsViewState from './schema/InsightsViewState';
import meetingInsightsCache from './schema/meetingInsightsCache';
import type MeetingInsightsStore from './schema/MeetingInsightsStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

const defaultMeetingInsightsStore: MeetingInsightsStore = {
    meetingIdToInsightsMap: new ObservableMap<string, InsightsViewState>({}),
    pendingServiceQueue: [],
};

meetingInsightsCache.initialize(defaultMeetingInsightsStore.meetingIdToInsightsMap);

export const getMeetingInsightsStore = createStore<MeetingInsightsStore>(
    'meetingInsightsStore',
    defaultMeetingInsightsStore
);

export default getMeetingInsightsStore();
