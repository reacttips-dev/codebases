import EvaluatorTestCase from 'bundles/author-code-evaluator/models/EvaluatorTestCase';

import type EvaluationResponse from 'bundles/code-evaluator/models/EvaluationResponse';

class EvaluatorTestCaseRunner {
  testCase: EvaluatorTestCase;

  response: EvaluationResponse | null;

  constructor({ testCase, response }: { testCase: EvaluatorTestCase; response: EvaluationResponse | null }) {
    this.testCase = testCase;
    this.response = response;
  }

  copy(): EvaluatorTestCaseRunner {
    const testCaseCopy = new EvaluatorTestCase(this.testCase.toJSON());
    const newEvaluator = new EvaluatorTestCaseRunner({
      response: this.response,
      testCase: testCaseCopy,
    });

    return newEvaluator;
  }

  get isPassed(): boolean {
    return this.response != null && this.response.hasIdenticalOutput(this.testCase.result);
  }

  get isFailed(): boolean {
    return this.response != null && !this.response.hasIdenticalOutput(this.testCase.result);
  }
}

export default EvaluatorTestCaseRunner;
