import PropTypes from 'prop-types';
import React from 'react';
import ConsoleOutput from 'bundles/code-evaluator/components/ConsoleOutput';
import CodeEvaluatorSlowProgressIndicator from 'bundles/code-evaluator/components/CodeEvaluatorSlowProgressIndicator';
import EvaluatorSummary from 'bundles/code-evaluator/models/EvaluatorSummary';
import _t from 'i18n!nls/code-evaluator';

class CodeEvaluatorProgress extends React.Component {
  static propTypes = {
    evaluatorSummary: PropTypes.instanceOf(EvaluatorSummary).isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluatorSummary' does not exist on type... Remove this comment to see the full error message
    const { evaluatorSummary, onCancel } = this.props;
    const {
      executionTimeSummary,
      executionTimeSummary: { isExecutionSlow },
    } = evaluatorSummary;

    return (
      <div className="rc-CodeEvaluatorProgress">
        {!isExecutionSlow && (
          <div className="in-progress">
            <ConsoleOutput>{_t('Processing...')}</ConsoleOutput>
          </div>
        )}

        {isExecutionSlow && (
          <CodeEvaluatorSlowProgressIndicator executionTimeSummary={executionTimeSummary} onCancel={onCancel} />
        )}
      </div>
    );
  }
}

export default CodeEvaluatorProgress;
