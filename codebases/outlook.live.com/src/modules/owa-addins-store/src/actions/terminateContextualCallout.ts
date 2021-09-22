import getExtensibilityState from '../store/getExtensibilityState';
import { action } from 'satcheljs/lib/legacy';

export default action('terminateContextualCallout')(function terminateContextualCallout() {
    const state = getExtensibilityState();
    state.runningContextualAddinCommand = null;
    state.contextualCalloutState.contextualAnchor = null;
    state.contextualCalloutState.activeContextualAddinCommands = [];
    state.contextualCalloutState.selectedTerms = [];
});
