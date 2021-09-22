import PropTypes from 'prop-types';
import React from 'react';

import StringOutput from 'bundles/code-evaluator/components/StringOutput';
import TestCaseOutput from 'bundles/code-evaluator/components/TestCaseOutput';
import ImageOutput from 'bundles/code-evaluator/components/ImageOutput';
import EvaluationResponse from 'bundles/code-evaluator/models/EvaluationResponse';

class SuccessOutput extends React.Component<{
  evaluationResponse: EvaluationResponse;
}> {
  static propTypes = {
    evaluationResponse: PropTypes.instanceOf(EvaluationResponse).isRequired,
  };

  render() {
    const { evaluationResponse } = this.props;
    const { stringOutput, testCaseOutput, imageDataOutput } = evaluationResponse;

    return (
      <div className="rc-SuccessOutput">
        {stringOutput && <StringOutput output={stringOutput} />}
        {testCaseOutput && <TestCaseOutput output={testCaseOutput} />}
        {imageDataOutput && <ImageOutput output={imageDataOutput} />}
      </div>
    );
  }
}

export default SuccessOutput;
