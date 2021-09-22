import type { RawReplHarness } from 'bundles/author-code-evaluator/models/ReplHarness';
import ReplHarness from 'bundles/author-code-evaluator/models/ReplHarness';

import type { RawTestCaseHarness } from 'bundles/author-code-evaluator/models/TestCaseHarness';
import TestCaseHarness from 'bundles/author-code-evaluator/models/TestCaseHarness';

export type RawHarness = RawReplHarness | RawTestCaseHarness;

const { ReplHarnessClassName } = ReplHarness;
const { TestCaseHarnessClassName } = TestCaseHarness;

type Evaluator = {
  versionedEngineId: string;
  harness: RawHarness;
};

export type RawEvaluatorDraft = {
  id: string;
  evaluator: Evaluator;
  isPublished: boolean;
};

class EvaluatorDraft {
  id: string;

  isPublished: boolean;

  versionedEngineId: string;

  evaluator: Evaluator;

  harness!: ReplHarness | TestCaseHarness;

  constructor({ id, evaluator, isPublished }: RawEvaluatorDraft) {
    this.id = id;
    this.evaluator = evaluator;
    this.isPublished = isPublished;
    this.versionedEngineId = this.evaluator.versionedEngineId;

    const { harness } = evaluator;

    // @ts-ignore
    if (harness[ReplHarnessClassName] != null) {
      // @ts-ignore
      this.harness = new ReplHarness(harness[ReplHarnessClassName]);
    } // @ts-ignore
    else if (harness[TestCaseHarnessClassName] != null) {
      // @ts-ignore
      this.harness = new TestCaseHarness(harness[TestCaseHarnessClassName]);
    }
  }

  toJSON(): RawEvaluatorDraft {
    const { id, isPublished, versionedEngineId } = this;
    const harness = this.harness.toJSON();
    const evaluator = { harness, versionedEngineId };

    return { id, evaluator, isPublished };
  }
}

export default EvaluatorDraft;
