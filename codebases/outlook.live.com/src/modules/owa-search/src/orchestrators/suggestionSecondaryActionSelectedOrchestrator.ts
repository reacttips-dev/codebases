import setNextSearchQueryId from '../mutators/setNextSearchQueryId';
import datapoints, { ButtonNames } from '../datapoints';
import { logUsage } from 'owa-analytics';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import {
    downloadFileSuggestion,
    shareFileSuggestion,
    suggestionSecondaryActionSelected,
    setIsSuggestionsDropdownVisible,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import type {
    Suggestion,
    FileSuggestion,
    EventSuggestion,
} from 'owa-search-service/lib/data/schema/SuggestionSet';
import { lazyLogSecondaryEntityActionClicked } from 'owa-search-instrumentation';
import type { EntityActionTakenType } from 'owa-search-instrumentation/lib/data/schema/substrateSearchLogTypes';
import { getGuid } from 'owa-guid';
import { copyLink } from 'owa-calendar-sharing/lib/utils/copyLink';

export default orchestrator(suggestionSecondaryActionSelected, actionMessage => {
    const {
        suggestion,
        suggestionIndex,
        suggestionSetTraceId,
        scenarioId,
        entityActionTakenType,
    } = actionMessage;

    switch (entityActionTakenType) {
        case 'Download':
            handleDownloadFileAction(
                suggestion as FileSuggestion,
                scenarioId,
                suggestionIndex,
                suggestionSetTraceId
            );
            break;
        case 'Share':
            handleShareFileAction(
                suggestion as FileSuggestion,
                scenarioId,
                suggestionIndex,
                suggestionSetTraceId
            );
            break;
        case 'OpenContactCard':
            handleOpenContactCardAction(
                suggestion,
                scenarioId,
                suggestionIndex,
                suggestionSetTraceId
            );
            break;
        case 'CopyLink':
            handleCopyFileLinkAction(
                suggestion as FileSuggestion,
                scenarioId,
                suggestionIndex,
                suggestionSetTraceId
            );
            break;
        case 'JoinMeeting':
            handleJoinMeetingAction(
                suggestion as EventSuggestion,
                scenarioId,
                suggestionIndex,
                suggestionSetTraceId
            );
            break;
        default:
            break;
    }

    // end conversation
    setNextSearchQueryId(getGuid(), scenarioId);
});

function logActionClicked(
    scenarioId: SearchScenarioId,
    buttonName: ButtonNames,
    suggestionIndex: number,
    suggestion: Suggestion,
    suggestionSetTraceId: string,
    entityActionTakenType: EntityActionTakenType
) {
    const { name: eventName, customData: customData } = datapoints.Search_QuickActionClicked;
    logUsage(eventName, customData(buttonName, SearchScenarioId[scenarioId], suggestionIndex));

    // log if traceId is not null
    if (suggestionSetTraceId) {
        lazyLogSecondaryEntityActionClicked.importAndExecute(
            suggestionSetTraceId,
            suggestion.ReferenceId,
            'EntityActionTaken',
            SubstrateSearchScenario.Mail,
            entityActionTakenType,
            getScenarioStore(scenarioId).traceIdToLogicalIdMap.get(suggestionSetTraceId)
        );
    }
}

function handleDownloadFileAction(
    fileSuggestion: FileSuggestion,
    scenarioId: SearchScenarioId,
    suggestionIndex: number,
    suggestionSetTraceId: string
) {
    downloadFileSuggestion(fileSuggestion.AttachmentId, fileSuggestion.AttachmentType, scenarioId);

    logActionClicked(
        scenarioId,
        'DownloadFile',
        suggestionIndex,
        fileSuggestion,
        suggestionSetTraceId,
        'Download'
    );
}

function handleShareFileAction(
    fileSuggestion: FileSuggestion,
    scenarioId: SearchScenarioId,
    suggestionIndex: number,
    suggestionSetTraceId: string
) {
    shareFileSuggestion(fileSuggestion.AttachmentId, fileSuggestion.AttachmentType, scenarioId);

    logActionClicked(
        scenarioId,
        'ShareFile',
        suggestionIndex,
        fileSuggestion,
        suggestionSetTraceId,
        'Share'
    );
}

function handleOpenContactCardAction(
    suggestion: Suggestion,
    scenarioId: SearchScenarioId,
    suggestionIndex: number,
    suggestionSetTraceId: string
) {
    logActionClicked(
        scenarioId,
        'ContactCard',
        suggestionIndex,
        suggestion,
        suggestionSetTraceId,
        'OpenContactCard'
    );

    setIsSuggestionsDropdownVisible(false, SearchScenarioId.Mail);
}

function handleCopyFileLinkAction(
    suggestion: FileSuggestion,
    scenarioId: SearchScenarioId,
    suggestionIndex: number,
    suggestionSetTraceId: string
) {
    copyLink(suggestion.WebUrl);

    logActionClicked(
        scenarioId,
        'CopyFileLink',
        suggestionIndex,
        suggestion,
        suggestionSetTraceId,
        'CopyLink'
    );
}

function handleJoinMeetingAction(
    suggestion: EventSuggestion,
    scenarioId: SearchScenarioId,
    suggestionIndex: number,
    suggestionSetTraceId: string
) {
    logActionClicked(
        scenarioId,
        'JoinOnlineMeeting',
        suggestionIndex,
        suggestion,
        suggestionSetTraceId,
        'JoinMeeting'
    );
}
