import type { EvaluationResult } from 'bundles/code-evaluator/models/EvaluationResponse';
import EvaluationResponse from 'bundles/code-evaluator/models/EvaluationResponse';

export type RawEvaluatorTestCase = {
  name: string;
  expression: string;
  result: EvaluationResult | null;
  latestEvaluationId: string | null | undefined;
};

class EvaluatorTestCase {
  name: string;

  expression: string;

  result: EvaluationResponse | null;

  latestEvaluationId: string | null | undefined;

  constructor({ name, expression, result, latestEvaluationId }: RawEvaluatorTestCase) {
    this.name = name;
    this.expression = expression;
    this.result = result != null ? new EvaluationResponse({ id: '', result }) : null;
    this.latestEvaluationId = latestEvaluationId;
  }

  toJSON(): RawEvaluatorTestCase {
    const { name, expression, latestEvaluationId } = this;
    const result = this.result && this.result.getEvaluationResult();

    if (latestEvaluationId == null) {
      return { name, expression, result, latestEvaluationId: undefined };
    }
    return { name, expression, result, latestEvaluationId };
  }
}

export default EvaluatorTestCase;
