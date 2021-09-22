import { SearchScenarioId } from 'owa-search-store';

/**
 * This is a helper function to determine if a received action was meant for the
 * search box in the mail module by comparing the scenarioId (that comes with each
 * action from owa-search) and comparing it to the mail module's designated value.
 * If these values don't match, the mutator/orchestrator checking will most likely
 * early return as the action received was not meant for them.
 */
export default function isMailSearchAction(scenarioId: SearchScenarioId): boolean {
    return scenarioId === SearchScenarioId.Mail;
}
