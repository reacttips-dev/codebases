import API from 'js/lib/api';
import URI from 'jsuri';
import Q from 'q';
import { LanguageType } from 'bundles/cml/constants/codeLanguages';

const api = API('/api/authoringEvaluatorTemplates.v1', { type: 'rest' });

const fields = ['name', 'tags'];

export type Evaluator = {
  id: string;
  name: string;
  tags: Array<LanguageType>;
};

export type EvaluatorTemplatesResponse = {
  elements: Array<Evaluator>;
};

export const getEvaluatorTemplatesForTag = (tag: string, courseId: string): Q.Promise<EvaluatorTemplatesResponse> => {
  const uri = new URI()
    .addQueryParam('fields', fields.join(','))
    .addQueryParam('q', 'tag')
    .addQueryParam('tag', tag)
    .addQueryParam('courseId', courseId);
  return Q(api.get(uri.toString()));
};

export const getTestCaseHarnessEvaluatorTemplates = () => {
  const uri = new URI().addQueryParam('fields', fields.join(',')).addQueryParam('q', 'withTestCaseHarness');
  return Q(api.get(uri.toString()));
};
