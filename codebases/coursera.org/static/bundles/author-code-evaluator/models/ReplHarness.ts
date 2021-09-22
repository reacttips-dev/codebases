import ExpressionHarness from 'bundles/author-code-evaluator/models/ExpressionHarness';

const ReplHarnessClassName = 'org.coursera.eval.evaluator.ReplHarness';

class ReplHarness extends ExpressionHarness {
  static ReplHarnessClassName = ReplHarnessClassName;

  toJSON(): RawReplHarness {
    return {
      'org.coursera.eval.evaluator.ReplHarness': {
        preamble: this.preamble,
      },
    };
  }
}

export type RawReplHarness = {
  'org.coursera.eval.evaluator.ReplHarness': {
    preamble: string;
  };
  'org.coursera.eval.evaluator.TestCaseHarness'?: void;
};

export default ReplHarness;
