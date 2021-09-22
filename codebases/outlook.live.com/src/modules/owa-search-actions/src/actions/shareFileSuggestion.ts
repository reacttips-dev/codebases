import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

/**
 * Action dispatched when the share button is clicked from a file suggestion.
 * Consuming client should have an orchestrator that subscribes to it to perform the
 * intended functionality of the button.
 */
export const shareFileSuggestion = action(
    'SHARE_FILE_SUGGESTION',
    (attachmentId: string, attachmentType: AttachmentType, scenarioId: SearchScenarioId) => ({
        attachmentId,
        attachmentType,
        scenarioId,
    })
);
