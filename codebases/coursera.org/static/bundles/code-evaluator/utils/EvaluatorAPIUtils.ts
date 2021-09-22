import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

// @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
const evalResultsAPI = new API('/api/evalResults.v1?includes=logs,feedback', {
  type: 'rest',
});
// @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
const evalEvaluatorSummariesAPI = new API('/api/evalEvaluatorSummaries.v1', {
  type: 'rest',
});

const EvaluatorAPIUtils = {
  run: (evaluatorId: $TSFixMe, expression: $TSFixMe) => {
    const options = {
      data: { evaluatorId, expression },
    };
    return Q(evalResultsAPI.post('', options)).then((response) => {
      // Parse out related logs resource
      const newResponse = Object.assign({}, response.elements[0]);
      newResponse.logUrls = response.linked['evalEvaluationLogs.v1'][0];

      const relatedHints = response.linked['evalNextGenResults.v1'];
      newResponse.hints = (relatedHints && relatedHints[0] && relatedHints[0].hints) || [];

      return newResponse;
    });
  },

  getSummary: (evaluatorId: $TSFixMe) => {
    const uri = new URI(evaluatorId).addQueryParam('fields', ['executionTimeSummary', 'latestUserExpression'].join());

    return Q(evalEvaluatorSummariesAPI.get(uri.toString())).then((response) => response.elements[0]);
  },
};

export default EvaluatorAPIUtils;

export const { run, getSummary } = EvaluatorAPIUtils;
