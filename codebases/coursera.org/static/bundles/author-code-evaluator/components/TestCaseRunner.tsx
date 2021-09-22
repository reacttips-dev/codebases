import PropTypes from 'prop-types';
import React from 'react';

import TestCasePill from 'bundles/author-code-evaluator/components/TestCasePill';
import Modal from 'bundles/author-common/components/Modal';
import Evaluation from 'bundles/code-evaluator/models/Evaluation';
import EvaluatorTestCaseRunner from 'bundles/author-code-evaluator/models/EvaluatorTestCaseRunner';
import _t from 'i18n!nls/author-code-evaluator';
import 'css!bundles/author-code-evaluator/components/__styles__/TestCaseRunner';

type State = {
  currentTestCaseIndex: number;
};

type Props = {
  evaluation: Evaluation;
  handleRun: (expression: string) => void;
  onCancel: () => void;
  onChange: (index: number, testCase: EvaluatorTestCaseRunner) => void;
  onClose: () => void;
  testCaseRunners: Array<EvaluatorTestCaseRunner>;
};

class TestCaseRunner extends React.Component<Props, State> {
  static propTypes = {
    evaluation: PropTypes.instanceOf(Evaluation).isRequired,
    handleRun: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    testCaseRunners: PropTypes.arrayOf(PropTypes.instanceOf(EvaluatorTestCaseRunner)).isRequired,
  };

  constructor(props: Props, context: any) {
    super(props, context);

    this.state = {
      currentTestCaseIndex: -1,
    };
  }

  componentWillMount() {
    this.runNextTestCase();
  }

  componentWillReceiveProps(newProps: Props) {
    if (this.props.evaluation !== newProps.evaluation && newProps.evaluation.response != null) {
      const { response } = newProps.evaluation;
      const latestEvaluationId = newProps.evaluation.response.id;

      const testCase = newProps.testCaseRunners[this.state.currentTestCaseIndex];
      const copy = testCase.copy();

      copy.testCase.latestEvaluationId = latestEvaluationId;
      copy.response = response;

      this.props.onChange(this.state.currentTestCaseIndex, copy);

      this.runNextTestCase();
    }
  }

  handleCancel = () => {
    this.props.onCancel();
    this.props.onClose();
  };

  runNextTestCase = () => {
    const { onClose, handleRun, testCaseRunners } = this.props;
    const { currentTestCaseIndex } = this.state;

    const nextTestCaseRunner = testCaseRunners.find((testCase, index) => index > currentTestCaseIndex);

    if (nextTestCaseRunner == null) {
      onClose();
    } else {
      const nextTestCaseIndex = testCaseRunners.indexOf(nextTestCaseRunner);
      this.setState({
        currentTestCaseIndex: nextTestCaseIndex,
      });

      handleRun(nextTestCaseRunner.testCase.expression);
    }
  };

  render() {
    const { testCaseRunners } = this.props;
    const { currentTestCaseIndex } = this.state;

    return (
      <Modal
        allowClose={false}
        withTitle={true}
        withFooter={true}
        heading={_t('Running test cases')}
        cancelLabel={_t('Cancel')}
        onCancel={this.handleCancel}
        hideConfirm={true}
        className="rc-TestCaseRunner"
      >
        <div>
          {testCaseRunners.map((testCaseEvaluator: EvaluatorTestCaseRunner, index: number) => {
            return (
              <span style={{ marginRight: 20 }} key={index}>
                <TestCasePill
                  name={testCaseEvaluator.testCase.name}
                  onClick={() => {}} // do nothing when selected
                  index={index}
                  isFailed={testCaseEvaluator.isFailed}
                  isPassed={testCaseEvaluator.isPassed}
                  isSelected={index === currentTestCaseIndex}
                />
              </span>
            );
          })}
        </div>
      </Modal>
    );
  }
}

export default TestCaseRunner;
