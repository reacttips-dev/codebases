import ExecutionTimeSummary from 'bundles/code-evaluator/models/ExecutionTimeSummary';

class EvaluatorSummary {
  constructor({ id, latestUserExpression, executionTimeSummary = {} }: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'EvaluatorSum... Remove this comment to see the full error message
    this.id = id;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'latestUserExpression' does not exist on ... Remove this comment to see the full error message
    this.latestUserExpression = latestUserExpression;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'executionTimeSummary' does not exist on ... Remove this comment to see the full error message
    this.executionTimeSummary = new ExecutionTimeSummary(executionTimeSummary);
  }
}

export default EvaluatorSummary;
