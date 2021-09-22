import type NotesStore from './schema/NotesStore';
import { createStore } from 'satcheljs';

let getStore = createStore<NotesStore>('notesStore', <NotesStore>{
    isPanelInitialized: false,
    isPanelOpen: false,
    sessionId: undefined,
    panelOpenTimestamp: undefined,
    source: undefined,
    selectedNoteId: undefined,
    selectedNoteColor: undefined,
});

export default getStore;
