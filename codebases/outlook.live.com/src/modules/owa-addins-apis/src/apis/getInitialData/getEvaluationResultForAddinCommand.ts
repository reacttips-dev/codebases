import { EvaluationResult, getHostItem } from 'owa-addins-store';

export default function getEvaluationResultForAddinCommand(
    hostItemIndex: string,
    extensionId: string
): EvaluationResult {
    const hostItem = getHostItem(hostItemIndex);
    if (
        hostItem?.contextualEvaluationResults &&
        hostItem.contextualEvaluationResults.has(extensionId)
    ) {
        return hostItem.contextualEvaluationResults.get(extensionId);
    }

    return null;
}
