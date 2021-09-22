import type { RawEvaluationResponse } from 'bundles/code-evaluator/models/EvaluationResponse';
import EvaluationResponse from 'bundles/code-evaluator/models/EvaluationResponse';

/**
 * Represents a code evaluation state.
 */
class Evaluation {
  id: string;

  active: boolean;

  fail: boolean;

  response: EvaluationResponse | null | undefined;

  constructor({
    active = false,
    fail = false,
    response,
  }: {
    active: boolean;
    fail: boolean;
    response: RawEvaluationResponse | null;
  }) {
    this.id = Math.random().toString(10);

    this.active = active;
    this.fail = fail;

    if (response != null) {
      this.response = new EvaluationResponse(response);
    }
  }

  get hasRequestError(): boolean {
    return !this.active && this.fail;
  }

  get hasSystemError(): boolean {
    return (
      !this.active &&
      !this.fail &&
      !!this.response &&
      (!!this.response.errorCodeResult || !!this.response.timeoutErrorResult)
    );
  }

  get hasRuntimeError(): boolean {
    return !this.active && !this.fail && !!this.response && !!this.response.runtimeErrorResult;
  }

  get hasSuccessResult(): boolean {
    return !this.active && !this.fail && !!this.response && !!this.response.successResult;
  }
}

export default Evaluation;
