import executeContextual from './executeContextual';
import { getExtensibilityState, initializeContextualCallout } from 'owa-addins-store';

export default function openContextualCallout(terms: string[], index: string, anchor: HTMLElement) {
    initializeContextualCallout(terms, index, anchor);

    const state = getExtensibilityState();
    executeContextual(index, state.contextualCalloutState.activeContextualAddinCommands[0]);
}
