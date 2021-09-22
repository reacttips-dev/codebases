import PropTypes from 'prop-types';
import React from 'react';
import ConsoleOutput from 'bundles/code-evaluator/components/ConsoleOutput';
import EvaluationResponse from 'bundles/code-evaluator/models/EvaluationResponse';
import _t from 'i18n!nls/code-evaluator';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import 'css!./__styles__/SystemError';

class SystemError extends React.Component {
  static propTypes = {
    evaluationResponse: PropTypes.instanceOf(EvaluationResponse).isRequired,
  };

  render() {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'evaluationResponse' does not exist on ty... Remove this comment to see the full error message
      evaluationResponse: { id, errorCodeResult, timeoutErrorResult },
    } = this.props;

    return (
      <div className="rc-SystemError">
        <ConsoleOutput>
          {errorCodeResult && _t(`System error logged with id ${id}. Please try again later.`)}

          {timeoutErrorResult && (
            <FormattedMessage
              message={_t(
                `Evaluation took more than {timeout} seconds to complete.
                Please try again with a simpler expression.`
              )}
              timeout={timeoutErrorResult.timeout / 1000}
            />
          )}
        </ConsoleOutput>
      </div>
    );
  }
}

export default SystemError;
