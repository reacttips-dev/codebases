import type ContextualAddinCommand from './ContextualAddinCommand';

export interface ContextualCalloutState {
    activeContextualAddinCommands: ContextualAddinCommand[];
    contextualAnchor: HTMLElement;
    hostItemIndex: string;
    selectedTerms: string[];
}

export function InitializeContextualCalloutState(): ContextualCalloutState {
    return {
        activeContextualAddinCommands: [],
        contextualAnchor: null,
        hostItemIndex: null,
        selectedTerms: [],
    };
}
