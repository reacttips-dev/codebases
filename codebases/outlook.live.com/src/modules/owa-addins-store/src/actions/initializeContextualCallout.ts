import type ContextualAddinCommand from '../store/schema/ContextualAddinCommand';
import getExtensibilityState from '../store/getExtensibilityState';
import getHostItem from '../store/getHostItem';
import terminateContextualCallout from './terminateContextualCallout';
import { action } from 'satcheljs/lib/legacy';
import type { ExtensibilityHostItem } from '../store/schema/ExtensibilityHostItem';
import { ObservableMap } from 'mobx';

export default action('initializeContextualCallout')(function initializeContextualCallout(
    terms: string[],
    index: string,
    anchor: HTMLElement
) {
    const state = getExtensibilityState();
    if (state.runningContextualAddinCommand) {
        terminateContextualCallout();
    }

    const hostItem: ExtensibilityHostItem = getHostItem(index);
    const uniqueActiveAddins = new ObservableMap<string, ContextualAddinCommand>();
    const calloutState = state.contextualCalloutState;
    calloutState.selectedTerms = [];
    terms.forEach(term => {
        const addins = hostItem.contextualTerms.get(term).slice();
        if (addins && addins.length > 0) {
            calloutState.selectedTerms.push(term);
            addins.forEach(addin => {
                uniqueActiveAddins.set(addin.get_Id(), addin);
            });
        }
    });

    calloutState.contextualAnchor = anchor;
    calloutState.activeContextualAddinCommands = [...uniqueActiveAddins.values()];
    calloutState.hostItemIndex = index;
});
