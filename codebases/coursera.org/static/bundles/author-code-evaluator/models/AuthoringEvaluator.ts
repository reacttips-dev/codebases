import type {
  Metadata,
  AuthoringEvaluatorResponse,
} from 'bundles/author-code-evaluator/utils/AuthoringEvaluatorAPIUtils';

import EvaluatorDraft from 'bundles/author-code-evaluator/models/EvaluatorDraft';
import EvaluatorTestCase from 'bundles/author-code-evaluator/models/EvaluatorTestCase';

class AuthoringEvaluator {
  id: string;

  metadata: Metadata;

  testCases: Array<EvaluatorTestCase>;

  draft: EvaluatorDraft;

  static getUnversionedId(versionedId: string): string {
    const parts = versionedId.split('@');
    return parts[0];
  }

  constructor({ id, draft, testCases, metadata }: AuthoringEvaluatorResponse) {
    this.id = id;
    this.metadata = metadata;
    this.testCases = testCases.map((testCase) => new EvaluatorTestCase(testCase));
    this.draft = new EvaluatorDraft(draft);
  }

  get versionedId(): string {
    const {
      id,
      metadata: { publishedVersion },
    } = this;
    return `${id}@${publishedVersion}`;
  }

  toJSON(): AuthoringEvaluatorResponse {
    const { id, metadata } = this;
    const draft = this.draft.toJSON();
    const testCases = this.testCases.map((testCase) => testCase.toJSON());

    return { id, draft, testCases, metadata };
  }
}

export default AuthoringEvaluator;
