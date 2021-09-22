import type { TestCaseOutputContents } from 'bundles/code-evaluator/models/EvaluationResponse';

import React from 'react';
import classNames from 'classnames';
import ConsoleOutput from 'bundles/code-evaluator/components/ConsoleOutput';
import 'css!./__styles__/TestCaseOutput';

class TestCaseOutput extends React.Component<{
  output: TestCaseOutputContents;
}> {
  render() {
    const {
      output: { message, isCorrect },
    } = this.props;

    const classes = classNames('rc-TestCaseOutput', {
      correct: isCorrect,
    });

    return (
      <div className={classes}>
        <ConsoleOutput>{message}</ConsoleOutput>
      </div>
    );
  }
}

export default TestCaseOutput;
