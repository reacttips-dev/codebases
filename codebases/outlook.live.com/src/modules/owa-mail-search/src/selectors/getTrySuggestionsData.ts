import { getItem, removeItem } from 'owa-local-storage';
import {
    TRY_SUGGESTION_FIRST_SHOWN,
    TRY_SUGGESTION_DISPLAY_COUNT_STRING,
    TRY_SUGGESTION_CLICK_COUNT_STRING,
    TRY_SUGGESTION_IDS_STRING,
} from '../searchConstants';
import { isFeatureEnabled } from 'owa-feature-flags';
import { is3SServiceAvailable } from 'owa-search';

const SEVEN_DAYS_IN_MILLISECONDS: number = 604800000;

export function getFirstTimeTrySuggestionShown() {
    const timeFirstShown = parseInt(getItem(window, TRY_SUGGESTION_FIRST_SHOWN));
    return timeFirstShown;
}

export function shouldShowTrySuggestions(
    queryStringForSuggestions: string,
    timeFirstShown: number
): boolean {
    if (is3SServiceAvailable() && queryStringForSuggestions.length == 0) {
        // if the testing feature sea-teachNL-suggestions-always is enabled, always show the suggestions
        if (isFeatureEnabled('sea-teachNL-suggestions-always')) {
            return true;
        } else if (isFeatureEnabled('sea-teachNL-suggestions')) {
            if (!timeFirstShown) {
                return true; // show suggestions if we've never shown them before
            }

            // we only want to show the suggestions for 7 days after they were first shown
            const differenceInMS = Date.now() - timeFirstShown;
            return differenceInMS <= SEVEN_DAYS_IN_MILLISECONDS;
        }
    }

    return false;
}

function cleanupKey(key: string) {
    const setting = getItem(window, key);
    if (setting) {
        removeItem(window, key);
    }
}

export function cleanupTrySuggestionData() {
    cleanupKey(TRY_SUGGESTION_DISPLAY_COUNT_STRING);
    cleanupKey(TRY_SUGGESTION_CLICK_COUNT_STRING);
    cleanupKey(TRY_SUGGESTION_IDS_STRING);
}
