import type { RawEvaluatorTestCase } from 'bundles/author-code-evaluator/models/EvaluatorTestCase';
import type { RawEvaluatorDraft } from 'bundles/author-code-evaluator/models/EvaluatorDraft';

import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';
import type AuthoringEvaluator from 'bundles/author-code-evaluator/models/AuthoringEvaluator';

const authoringEvaluatorsAPI = API('/api/authoringEvaluators.v1', {
  type: 'rest',
});

export type Metadata = {
  publishedVersion: string;
};

export type AuthoringEvaluatorResponse = {
  id: string;
  draft: RawEvaluatorDraft;
  testCases: Array<RawEvaluatorTestCase>;
  metadata: Metadata;
};

const exported = {
  get: (id: string) => Q(authoringEvaluatorsAPI.get(id)).then((response) => response.elements[0]),

  create: ({
    courseId,
    evaluatorId,
    branchId,
    itemId,
  }: {
    courseId: string;
    evaluatorId: string;
    branchId: string;
    itemId: string;
  }): Q.Promise<AuthoringEvaluatorResponse> => {
    return Q(
      authoringEvaluatorsAPI.post('', {
        data: {
          courseId,
          parentEvaluatorId: evaluatorId,
          branchId,
          itemId,
        },
      })
    ).then((response) => response.elements[0]);
  },

  save: (authoringEvaluator: AuthoringEvaluator): Q.Promise<AuthoringEvaluatorResponse> => {
    const { id } = authoringEvaluator;

    return Q(
      authoringEvaluatorsAPI.put(id, {
        data: authoringEvaluator.toJSON(),
      })
    ).then((response) => response.elements[0]);
  },

  publish: (authoringEvaluator: AuthoringEvaluator): Q.Promise<AuthoringEvaluatorResponse> => {
    const { id, metadata } = authoringEvaluator;

    const uri = new URI().addQueryParam('action', 'publish').addQueryParam('id', id);

    return Q(
      authoringEvaluatorsAPI.post(uri.toString(), {
        data: { metadata },
      })
    );
  },
};

export default exported;

export const { get, create, save, publish } = exported;
