import Evaluation from 'bundles/code-evaluator/models/Evaluation';
import EvaluatorAPIUtils from 'bundles/code-evaluator/utils/EvaluatorAPIUtils';

class EvaluationRunner {
  constructor(evaluatorId: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluatorId' does not exist on type 'Eva... Remove this comment to see the full error message
    this.evaluatorId = evaluatorId;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    this.evaluation = new Evaluation({});
  }

  run(expression: $TSFixMe, onUpdate: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    this.evaluation = new Evaluation({ active: true });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    onUpdate(this.evaluation);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    const activeEvaluationId = this.evaluation.id;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluatorId' does not exist on type 'Eva... Remove this comment to see the full error message
    EvaluatorAPIUtils.run(this.evaluatorId, expression)
      .then((response) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
        if (activeEvaluationId === this.evaluation.id) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
          this.evaluation = new Evaluation({ response });
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
          onUpdate(this.evaluation);
        }
      })
      .fail((response) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
        if (activeEvaluationId === this.evaluation.id) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
          this.evaluation = new Evaluation({ fail: true });
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
          onUpdate(this.evaluation);
        }
      });
  }

  cancel(onUpdate: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    this.evaluation = new Evaluation({});
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Eval... Remove this comment to see the full error message
    onUpdate(this.evaluation);
  }
}

export default EvaluationRunner;
