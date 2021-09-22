import PropTypes from 'prop-types';
import React from 'react';
import RequestError from 'bundles/code-evaluator/components/RequestError';
import SystemError from 'bundles/code-evaluator/components/SystemError';
import RuntimeError from 'bundles/code-evaluator/components/RuntimeError';
import SuccessOutput from 'bundles/code-evaluator/components/SuccessOutput';
import CodeEvaluatorProgress from 'bundles/code-evaluator/components/CodeEvaluatorProgress';
import Evaluation from 'bundles/code-evaluator/models/Evaluation';
import EvaluatorSummary from 'bundles/code-evaluator/models/EvaluatorSummary';
import EvaluatorAPIUtils from 'bundles/code-evaluator/utils/EvaluatorAPIUtils';
import 'css!./__styles__/CodeEvaluatorOutput';

class CodeEvaluatorOutput extends React.Component {
  static propTypes = {
    evaluation: PropTypes.instanceOf(Evaluation),
    evaluatorId: PropTypes.string,
    evaluatorSummary: PropTypes.instanceOf(EvaluatorSummary),
    onCancel: PropTypes.func.isRequired,
  };

  // @ignore ts-migrate(2345) FIXME: Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
  state = { evaluatorSummary: new EvaluatorSummary({}) };

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluatorId' does not exist on type 'Rea... Remove this comment to see the full error message
    const { evaluatorId, evaluatorSummary } = this.props;
    if (!evaluatorSummary) {
      EvaluatorAPIUtils.getSummary(evaluatorId).then((response) => {
        const newSummary = new EvaluatorSummary(response);
        this.setState({ evaluatorSummary: newSummary });
      });
    }
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Read... Remove this comment to see the full error message
    const { evaluation, onCancel } = this.props;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluatorSummary' does not exist on type... Remove this comment to see the full error message
    const evaluatorSummary = this.props.evaluatorSummary || this.state.evaluatorSummary;

    const { active, response, hasRequestError, hasSuccessResult, hasRuntimeError, hasSystemError } = evaluation;

    if (!active && !hasRequestError && !response) {
      return null;
    }

    return (
      <div className="rc-CodeEvaluatorOutput">
        {active && <CodeEvaluatorProgress evaluatorSummary={evaluatorSummary} onCancel={onCancel} />}

        {hasRequestError && <RequestError />}

        {hasSuccessResult && <SuccessOutput evaluationResponse={response} />}
        {hasRuntimeError && <RuntimeError evaluationResponse={response} />}
        {hasSystemError && <SystemError evaluationResponse={response} />}
      </div>
    );
  }
}

export default CodeEvaluatorOutput;
