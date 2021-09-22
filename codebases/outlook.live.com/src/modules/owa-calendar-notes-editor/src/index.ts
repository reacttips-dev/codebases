import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CalendarNotesEditor"*/ './lazyIndex')
);

export const NotesEditor = createLazyComponent(lazyModule, m => m.NotesEditor);

export type { NotesEditorInitializationConfig } from './schema/NotesEditorInitializationConfig';

export const lazyOpenNotesEditor = new LazyAction(lazyModule, m => m.openNotesEditor);
export const lazyCloseNotesEditor = new LazyAction(lazyModule, m => m.closeNotesEditor);

export const lazySetProposedTime = new LazyAction(lazyModule, m => m.setProposedTime);

export { default as getNotesEditorViewState } from './selectors/getNotesEditorViewState';
export { isNotesEditorOpen } from './selectors/isNotesEditorOpen';
export { isNotesEditorDirty } from './selectors/isNotesEditorDirty';
