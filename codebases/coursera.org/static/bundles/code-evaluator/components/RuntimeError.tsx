import PropTypes from 'prop-types';
import React from 'react';
import EvaluationResponse from 'bundles/code-evaluator/models/EvaluationResponse';
import ConsoleOutput from 'bundles/code-evaluator/components/ConsoleOutput';
import 'css!./__styles__/RuntimeError';

class RuntimeError extends React.Component {
  static propTypes = {
    evaluationResponse: PropTypes.instanceOf(EvaluationResponse).isRequired,
  };

  render() {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluationResponse' does not exist on ty... Remove this comment to see the full error message
      evaluationResponse: { runtimeErrorResult },
    } = this.props;
    const { errors } = runtimeErrorResult;

    return (
      <div className="rc-RuntimeError" role="alert">
        <ConsoleOutput>
          {errors.map((error: $TSFixMe) => {
            return <div key={error.message}>{error.message}</div>;
          })}
        </ConsoleOutput>
      </div>
    );
  }
}

export default RuntimeError;
