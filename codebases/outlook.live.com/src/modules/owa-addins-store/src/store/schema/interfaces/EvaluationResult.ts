import type KnownEntityType from 'owa-service/lib/contract/KnownEntityType';
import type FilteredEntities from './FilteredEntities';

/**
 * Represents the results of contextual activation
 *
 * @interface EvaluationResult
 */
export interface EvaluationResult {
    /**
     * Dictionary of RegEx Matches
     *
     * @type {Dictionary}
     */
    regExMatches?: { [index: string]: string[] };

    /**
     * List of Known Entity Type Matches
     *
     * @type {any[]}
     */
    matchedKnownEntityTypes?: KnownEntityType[];

    /**
     * List of Known Entities filtered by RegEx Matches
     *
     * @type {FilteredEntities}
     */
    filteredEntityMatches: FilteredEntities;
}

export function createEvaluationResult(): EvaluationResult {
    return {
        regExMatches: {},
        matchedKnownEntityTypes: [],
        filteredEntityMatches: {},
    };
}

export default EvaluationResult;
