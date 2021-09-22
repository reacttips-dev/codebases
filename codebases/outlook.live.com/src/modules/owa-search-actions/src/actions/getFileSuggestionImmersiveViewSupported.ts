import { action } from 'satcheljs';
import type { FileSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Action dispatched when a file suggestion is shown.
 * Consuming client should have an orchestrator that subscribes to it that handles
 * setting whether immersive view is supported.
 */
export const getFileSuggestionImmersiveViewSupported = action(
    'GET_FILE_SUGGESTION_IMMERSIVE_VIEW',
    (suggestion: FileSuggestion) => ({
        suggestion,
    })
);
