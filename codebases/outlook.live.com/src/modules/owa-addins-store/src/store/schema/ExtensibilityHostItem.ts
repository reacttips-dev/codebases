import type ContextualAddinCommand from './ContextualAddinCommand';
import type EvaluationResult from './interfaces/EvaluationResult';
import type { ObservableMap } from 'mobx';

export interface ExtensibilityHostItem {
    contextualTerms: ObservableMap<string, ContextualAddinCommand[]>;
    contextualEvaluationResults: ObservableMap<string, EvaluationResult>;
}

export function createExtensibilityHostItem(): ExtensibilityHostItem {
    return {
        contextualTerms: null,
        contextualEvaluationResults: null,
    };
}
