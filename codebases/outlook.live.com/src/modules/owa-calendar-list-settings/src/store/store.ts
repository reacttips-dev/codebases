import type { CalendarListSettingsStore } from './schema/CalendarListSettingsStore';
import { isConsumer } from 'owa-session-store';
import { getTimePanelConfig } from 'owa-time-panel-config';
import { createStore } from 'satcheljs';

export const getStore = createStore<CalendarListSettingsStore>('calendarListSettingsStore', {
    selectedView: getTimePanelConfig().initialCalendarView,
    // for consumer users, default to true to optimize for date navigation over view density
    isDatePickerExpanded: isConsumer(),
    isTaskListSelected: true,
});
