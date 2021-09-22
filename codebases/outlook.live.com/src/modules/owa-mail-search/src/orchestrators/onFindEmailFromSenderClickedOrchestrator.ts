import { findEmailFromSender } from '../actions/publicActions';
import { logUsage } from 'owa-analytics';
import { addSuggestionPill, clearSearchBox, startSearch } from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';
import { PeopleSuggestion, SuggestionKind } from 'owa-search-service';
import { orchestrator } from 'satcheljs';

orchestrator(findEmailFromSender, actionMessage => {
    const { senderName, senderEmail } = actionMessage;

    const persona: PeopleSuggestion = {
        kind: SuggestionKind.People,
        DisplayName: senderName,
        HighlightedDisplayName: senderName,
        EmailAddresses: [senderEmail],
        ReferenceId: null,
        Attributes: null,
        Source: 'none',
        QueryText: `from:(${senderEmail})`,
    };

    logUsage('Search_FindEmailFromSender_Clicked');

    clearSearchBox(SearchScenarioId.Mail);
    addSuggestionPill(persona, false /* suggestionSelected */, SearchScenarioId.Mail);
    startSearch('FindEmailFromSender', SearchScenarioId.Mail);
});
