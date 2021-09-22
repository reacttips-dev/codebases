import ExpressionHarness from 'bundles/author-code-evaluator/models/ExpressionHarness';

class TestCaseHarness extends ExpressionHarness {
  testCase: string;

  static TestCaseHarnessClassName = 'org.coursera.eval.evaluator.TestCaseHarness';

  constructor({ preamble, testCase }: { preamble: string; testCase: string }) {
    super({ preamble });
    this.testCase = testCase;
  }

  toJSON(): RawTestCaseHarness {
    return {
      'org.coursera.eval.evaluator.TestCaseHarness': {
        preamble: this.preamble,
        testCase: this.testCase,
      },
    };
  }
}

export type RawTestCaseHarness = {
  'org.coursera.eval.evaluator.TestCaseHarness': {
    preamble: string;
    testCase: string;
  };
  'org.coursera.eval.evaluator.ReplHarness'?: void;
};

export default TestCaseHarness;
