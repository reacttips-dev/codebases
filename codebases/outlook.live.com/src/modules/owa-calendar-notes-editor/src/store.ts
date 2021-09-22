import type NotesEditorStore from './schema/NotesEditorStore';
import { ObservableMap } from 'mobx';
import type NotesEditorViewState from './schema/NotesEditorViewState';
import { createStore } from 'satcheljs';

const store = createStore<NotesEditorStore>('calendarNotesEditorStore', {
    meetingIdToNotesViewStateMap: new ObservableMap<string, NotesEditorViewState>(),
});

export default store;
