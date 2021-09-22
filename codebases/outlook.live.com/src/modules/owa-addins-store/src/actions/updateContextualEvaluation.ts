import type ContextualAddinCommand from '../store/schema/ContextualAddinCommand';
import type EvaluationResult from '../store/schema/interfaces/EvaluationResult';
import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';
import type { ExtensibilityHostItem } from '../store/schema/ExtensibilityHostItem';
import type { ObservableMap } from 'mobx';

export interface UpdateContextualEvaluationState {
    hostItem: ExtensibilityHostItem;
}

/**
 * Updates a host item in the store with the results of a contextual activation evaluation
 *
 * @param hostItemIndex The index of the host item to update
 * @param terms The new contextual terms
 */
export default action('updateContextualEvaluation')(function updateContextualEvaluation(
    hostItemIndex: string,
    terms: ObservableMap<string, ContextualAddinCommand[]>,
    evaluationResults: ObservableMap<string, EvaluationResult>,
    state: UpdateContextualEvaluationState = {
        hostItem: extensibilityState.HostItems.get(hostItemIndex),
    }
) {
    const hostItem = state.hostItem;
    if (hostItem) {
        hostItem.contextualTerms = terms;
        hostItem.contextualEvaluationResults = evaluationResults;
    }
});
