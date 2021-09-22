import { getEntities, getSelectedEntities } from './Entities';
import getEvaluationResultForAddinCommand from './getEvaluationResultForAddinCommand';
import getSelectedRegExMatches from './getSelectedRegExMatches';
import type InitialData from './InitialData';
import getEntityExtractionResult from '../../services/getEntityExtractionResult';
import type Item from 'owa-service/lib/contract/Item';
import {
    getExtensibilityState,
    IAddinCommand,
    updateEntityExtractionResult,
} from 'owa-addins-store';

export default async function getInitialContextualData(
    hostItemIndex: string,
    item: Item,
    addInCommand: IAddinCommand,
    data: InitialData
): Promise<InitialData> {
    if (!item.EntityExtractionResult && isMissingExtractedEntityProperties(item)) {
        try {
            const response = await getEntityExtractionResult(item);
            updateEntityExtractionResult(item, response.EntityExtractionResult);
        } catch (e) {}
    }

    if (item.EntityExtractionResult) {
        data.entities = getEntities(item.EntityExtractionResult, item, addInCommand);
        if (data.entities) {
            const entities = JSON.parse(JSON.stringify(data.entities));
            data.selectedEntities = getSelectedEntities(
                entities,
                getExtensibilityState().contextualCalloutState.selectedTerms
            );
        }
    }

    const evaluationResult = getEvaluationResultForAddinCommand(
        hostItemIndex,
        addInCommand.extension.Id
    );
    if (evaluationResult) {
        data.filteredEntities = evaluationResult.filteredEntityMatches;
        data.regExMatches = evaluationResult.regExMatches;
        data.selectedRegExMatches = getSelectedRegExMatches(data.regExMatches);
    }

    return data;
}

function isMissingExtractedEntityProperties(item: Item): boolean {
    return (
        item.PropertyExistence &&
        (item.PropertyExistence.ExtractedAddresses ||
            item.PropertyExistence.ExtractedContacts ||
            item.PropertyExistence.ExtractedEmails ||
            item.PropertyExistence.ExtractedMeetings ||
            item.PropertyExistence.ExtractedPhones ||
            item.PropertyExistence.ExtractedTasks ||
            item.PropertyExistence.ExtractedUrls)
    );
}
