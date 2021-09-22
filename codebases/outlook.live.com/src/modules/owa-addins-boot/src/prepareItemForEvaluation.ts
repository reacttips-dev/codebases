import type Item from 'owa-service/lib/contract/Item';
import { ContextualAddinCommand, updateEntityExtractionResult } from 'owa-addins-store';
import { getEntityExtractionResult } from 'owa-addins-apis';
import { itemIsReadyForEvaluation } from './ContextualRulesEngine';

export default async function prepareItemForEvaluation(
    item: Item,
    contextualAddinCommands: ContextualAddinCommand[]
): Promise<void> {
    if (!itemIsReadyForEvaluation(contextualAddinCommands, item)) {
        const response = await getEntityExtractionResult(item);
        updateEntityExtractionResult(item, response.EntityExtractionResult);
    }
}
