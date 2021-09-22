import PropTypes from 'prop-types';
import React from 'react';
import CodeEvaluatorOutput from 'bundles/code-evaluator/components/CodeEvaluatorOutput';
import Evaluation from 'bundles/code-evaluator/models/Evaluation';
import _t from 'i18n!nls/author-code-evaluator';

class CodeOutput extends React.Component {
  static propTypes = {
    evaluatorDraftId: PropTypes.string.isRequired,
    evaluation: PropTypes.instanceOf(Evaluation).isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluation' does not exist on type 'Read... Remove this comment to see the full error message
    const { evaluation, evaluatorDraftId, onCancel } = this.props;
    const { active, response } = evaluation;

    return (
      <div className="rc-CodeOutput">
        {!active && !response && (
          <div className="caption-text color-secondary-text" style={{ margin: 16 }}>
            {_t('Run the code on the left to see the output that learners will see when running your code.')}
          </div>
        )}

        <CodeEvaluatorOutput onCancel={onCancel} evaluation={evaluation} evaluatorId={evaluatorDraftId} />
      </div>
    );
  }
}

export default CodeOutput;
