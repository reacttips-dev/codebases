import {
    createLazyComponent,
    LazyModule,
    registerLazyOrchestrator,
    LazyAction,
} from 'owa-bundling';
import { openOneNoteFeedPanel } from 'owa-notes-feed-bootstrap';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "OwaNotes" */ './lazyIndex'));

// Lazy orchestrator
registerLazyOrchestrator(openOneNoteFeedPanel, lazyModule, m => m.openOneNoteFeedPanelOrchestrator);

// Lazy selector
export const lazyIsPanelOpen = new LazyAction(lazyModule, m => m.isPanelOpen);

// Delay loaded components
export const NotesPane = createLazyComponent(lazyModule, m => m.NotesPane);
export const NoteColorButton = createLazyComponent(lazyModule, m => m.ChangeColorButton);
export const NoteEditView = createLazyComponent(lazyModule, m => m.NoteEditView);
