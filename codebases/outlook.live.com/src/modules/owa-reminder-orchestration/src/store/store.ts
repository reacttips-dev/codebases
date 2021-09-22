import { createStore } from 'satcheljs';
import type ReminderStore from './schema/ReminderStore';
import type ParsedReminder from './schema/ParsedReminder';
import { ObservableMap } from 'mobx';

var initialiState: ReminderStore = {
    reminders: new ObservableMap<string | null, ParsedReminder[]>(),
    charmIdMap: new ObservableMap<string, number>(),
};

export default createStore<ReminderStore>('reminders', initialiState);
