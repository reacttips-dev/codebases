import { isFeatureEnabled } from 'owa-feature-flags';
import { SearchScenarioId } from 'owa-search-store';

/**
 * Helper function to return "X-Client-Flights" header value to compose with
 * server flights
 */
export default function getXClientFlightsHeaderValue(scenarioId: SearchScenarioId): string {
    if (scenarioId !== SearchScenarioId.Mail) {
        return null;
    }

    const flightNames: string[] = [];
    if (isFeatureEnabled('sea-files-mru')) {
        flightNames.push('ZQFileSuggestionsOwa');
    }

    if (isFeatureEnabled('sea-joinEventSuggestion')) {
        flightNames.push('CalIncludeOngoing');
    }

    if (isFeatureEnabled('sea-bestmatch-v15')) {
        flightNames.push('OWA_BestMatch_V15');
    }

    if (isFeatureEnabled('sea-bestmatch-v23')) {
        flightNames.push('OWA_BestMatch_V23');
    }

    if (isFeatureEnabled('sea-calendarAnswer-v2')) {
        flightNames.push('CalendarInsightsFlight');
    }

    return flightNames.length > 0 ? flightNames.join(',') : null;
}
