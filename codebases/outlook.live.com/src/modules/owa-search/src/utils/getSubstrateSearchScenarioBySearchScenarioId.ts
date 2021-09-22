import { SearchScenarioId } from 'owa-search-store';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';

export default function getSubstrateSearchScenarioBySearchScenarioId(
    scenarioId: SearchScenarioId
): SubstrateSearchScenario {
    switch (scenarioId) {
        case SearchScenarioId.Mail:
            return SubstrateSearchScenario.Mail;
        case SearchScenarioId.Calendar:
            return SubstrateSearchScenario.Calendar;
        case SearchScenarioId.FilesHub:
            return SubstrateSearchScenario.FilesHub;
        case SearchScenarioId.Spaces:
            return SubstrateSearchScenario.Mail; // VSO 58256: Spaces needs to onbard with 3S and get its own ID, but for now we start with this
        case SearchScenarioId.FileSuggestions:
            return SubstrateSearchScenario.FileSuggestions;
        case SearchScenarioId.Yulee:
            return SubstrateSearchScenario.Mail; // ADO 109527: We need to figure out what a real search scenario for Yulee means
        default:
            throw Error(
                `No corresponding SubstrateSearchScenario for given SearchScenarioId (${scenarioId}).`
            );
    }
}
