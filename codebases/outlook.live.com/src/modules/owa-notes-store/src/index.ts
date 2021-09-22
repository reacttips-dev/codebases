import { LazyModule, LazyImport, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "OwaNotes" */ './lazyIndex'));

export const lazyGetNotesSDK = new LazyImport(lazyModule, m => m.getNotesSDK);
export const lazyContextType = new LazyImport(lazyModule, m => m.ContextType);

export const lazyCreateNoteFromMessageData = new LazyAction(
    lazyModule,
    m => m.createNoteFromMessageData
);
export const lazyCreateNewNote = new LazyAction(lazyModule, m => m.createNewNote);
export const lazyDeleteNote = new LazyAction(lazyModule, m => m.deleteNote);
export const lazyChangeNoteColor = new LazyAction(lazyModule, m => m.changeNoteColor);
export const lazySyncNotes = new LazyAction(lazyModule, m => m.syncNotes);
export const lazyViewEmailFromNote = new LazyAction(lazyModule, m => m.viewEmailFromNote);
export const lazyHasEmailId = new LazyImport(lazyModule, m => m.hasEmailId);

export { default as getStore } from './store/store';
