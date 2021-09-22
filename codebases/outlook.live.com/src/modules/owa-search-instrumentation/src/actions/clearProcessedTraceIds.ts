import { clearProcessedClientLayoutTraceIds } from './logSearchSuggestionsClientLayoutEvent';
import { clearProcessedResultsRenderedTraceIds } from './logSearchSuggestionsResultsRenderedEvent';

/**
 * Wrapper function to clear all processed trace ID caches for
 * v2 search instrumentation.
 */
export default function clearProcessedTraceIds() {
    clearProcessedClientLayoutTraceIds();
    clearProcessedResultsRenderedTraceIds();
}
