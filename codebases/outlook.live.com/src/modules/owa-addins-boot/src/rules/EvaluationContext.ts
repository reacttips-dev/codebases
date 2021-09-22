import { EvaluationResult, createEvaluationResult } from 'owa-addins-store';

export interface EvaluationContext {
    /**
     * Results of the contextual evaluation
     *
     * @type {EvaluationResult}
     */
    evaluationResult: EvaluationResult;

    /** The number highlightable entities on the item by KnownEntityType */
    highlightableEntities?: { [index: number]: number };

    /** The terms that the add-in may activate on */
    terms: string[];

    /** The item's body after it has been converted to plain-text */
    plainTextBody?: string;
}

/**
 * Creates an evaluation context
 * @param previousEvaluationContext The evaluation context from a previous evaluation
 * @return An EvaluationContext
 */
export function createEvaluationContext(
    previousEvaluationContext?: EvaluationContext
): EvaluationContext {
    const evaluationContext: EvaluationContext = {
        evaluationResult: createEvaluationResult(),
        highlightableEntities: {},
        terms: [],
    };

    if (previousEvaluationContext) {
        // Any cached plain text body can be re-used
        evaluationContext.plainTextBody = previousEvaluationContext.plainTextBody;

        // Statistics of entities used by a previous evaluation should be carried forward
        evaluationContext.highlightableEntities = previousEvaluationContext.highlightableEntities;
    }

    return evaluationContext;
}
