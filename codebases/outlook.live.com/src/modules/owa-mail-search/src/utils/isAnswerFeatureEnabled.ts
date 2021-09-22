import { isFeatureEnabled } from 'owa-feature-flags';
import is3SServiceAvailable from 'owa-search/lib/utils/is3SServiceAvailable';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';

export default function isAnswerFeatureEnabled() {
    return isCommonAnswerEnabled() || isBusinessAnswersEnabled();
}

function isCommonAnswerEnabled(): boolean {
    return (
        is3SServiceAvailable() &&
        (isFeatureEnabled('sea-fetchPeople3') ||
            isFeatureEnabled('sea-fetchEvents2') ||
            isFeatureEnabled('sea-calendarTriggerControl2') ||
            isFeatureEnabled('sea-fetchFlights2') ||
            isFeatureEnabled('sea-flightTriggerControl2') ||
            isFeatureEnabled('sea-fetchFiles4') ||
            isFeatureEnabled('sea-fileTriggerControl4') ||
            isFeatureEnabled('sea-peopleTriggerControl3') ||
            isFeatureEnabled('sea-answers-sdf') ||
            isFeatureEnabled('sea-answers-ms'))
    );
}

function isBusinessAnswersEnabled(): boolean {
    return (
        is3SServiceAvailable() &&
        isBusiness() &&
        (isFeatureEnabled('sea-fetchBookmarks2') ||
            isFeatureEnabled('sea-bookmarkTriggerControl2') ||
            isFeatureEnabled('sea-fetchAcronyms3') ||
            isFeatureEnabled('sea-fetchLinks2') ||
            isFeatureEnabled('sea-linkTriggerControl2') ||
            isFeatureEnabled('sea-acronymTriggerControl3') ||
            isFeatureEnabled('sea-answers-sdf') ||
            isFeatureEnabled('sea-answers-ms'))
    );
}
