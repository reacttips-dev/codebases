import type Item from 'owa-service/lib/contract/Item';
import prepareItemForEvaluation from './prepareItemForEvaluation';
import { evaluateRulesForEnabledAddinCommands } from './ContextualRulesEngine';
import { getAdapter } from 'owa-addins-adapters';
import { getContextualAddinCommand } from './ContextualChecker';
import { ObservableMap } from 'mobx';
import {
    ContextualAddinCommand,
    EvaluationResult,
    updateContextualEvaluation,
} from 'owa-addins-store';

export default async function runContextualEvaluationAndUpdate(item: Item, hostItemIndex: string) {
    const adapter = getAdapter(hostItemIndex);

    if (!adapter) {
        // The adapter may have been removed by the time this method is called
        return;
    }

    let isSharedItem = false;
    if (adapter.isSharedItem) {
        isSharedItem = adapter.isSharedItem();
    }
    const contextualAddinCommands: ContextualAddinCommand[] = getContextualAddinCommand(
        isSharedItem
    );
    const evaluationResults: { [index: string]: EvaluationResult } = {};

    await prepareItemForEvaluation(item, contextualAddinCommands);

    const activationTerms: ObservableMap<
        string,
        ContextualAddinCommand[]
    > = evaluateRulesForEnabledAddinCommands(contextualAddinCommands, item, evaluationResults);
    const evaluationResultsMap = new ObservableMap<string, EvaluationResult>(evaluationResults);
    updateContextualEvaluation(hostItemIndex, activationTerms, evaluationResultsMap);
}
