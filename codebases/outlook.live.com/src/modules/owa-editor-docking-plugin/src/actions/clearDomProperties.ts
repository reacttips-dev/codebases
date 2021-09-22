import type DockingViewState from '../store/schema/DockingViewState';
import { mutatorAction } from 'satcheljs';

// DOM elements stored in view state should be cleared to avoid
// circular structure TypeErrors during JSON serialization
export default mutatorAction('clearDomProperties', (viewState: DockingViewState) => {
    viewState.initialVisiblePart = null;
    viewState.dockingTriggerPart = null;
});
