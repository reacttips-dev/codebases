import { isEventHappeningNowHelper } from 'owa-online-meeting/lib/bootIndex';
import { userDate } from 'owa-datetime';
import type { EventSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { isFeatureEnabled } from 'owa-feature-flags';

export function shouldShowJoinQuickAction(suggestion: EventSuggestion): boolean {
    return (
        isFeatureEnabled('sea-joinEventSuggestion') &&
        suggestion &&
        !suggestion.IsAllDay &&
        !suggestion.IsCancelled &&
        (suggestion.SkypeTeamsMeetingUrl || suggestion.OnlineMeetingUrl) &&
        isEventHappeningNowHelper(userDate(suggestion.Start), userDate(suggestion.End))
    );
}
