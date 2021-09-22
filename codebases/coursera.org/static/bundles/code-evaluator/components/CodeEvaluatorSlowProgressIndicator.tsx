import PropTypes from 'prop-types';
import React from 'react';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import ProgressBar from 'bundles/phoenix/components/ProgressBar';
import ConsoleOutput from 'bundles/code-evaluator/components/ConsoleOutput';
import ExecutionTimeSummary from 'bundles/code-evaluator/models/ExecutionTimeSummary';
import _t from 'i18n!nls/code-evaluator';

import 'css!./__styles__/CodeEvaluatorSlowProgressIndicator';

const INTERVAL = 100;

class CodeEvaluatorSlowProgressIndicator extends React.Component {
  static propTypes = {
    executionTimeSummary: PropTypes.instanceOf(ExecutionTimeSummary).isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  constructor(props: $TSFixMe) {
    super(props);
    this.state = { timeInMs: 0 };
  }

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_isMounted' does not exist on type 'Code... Remove this comment to see the full error message
    this._isMounted = true;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'CodeEv... Remove this comment to see the full error message
    this.interval = setInterval(this.handleProgress, INTERVAL);
  }

  componentWillUnmount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_isMounted' does not exist on type 'Code... Remove this comment to see the full error message
    this._isMounted = false;
  }

  handleProgress = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'timeInMs' does not exist on type 'Readon... Remove this comment to see the full error message
    const { timeInMs } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'executionTimeSummary' does not exist on ... Remove this comment to see the full error message
    const { executionTimeSummary } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property '_isMounted' does not exist on type 'Code... Remove this comment to see the full error message
    if (executionTimeSummary.getPercent(timeInMs) === 100 || !this._isMounted) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'CodeEv... Remove this comment to see the full error message
      clearInterval(this.interval);
    } else {
      this.setState({ timeInMs: timeInMs + INTERVAL });
    }
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'timeInMs' does not exist on type 'Readon... Remove this comment to see the full error message
    const { timeInMs } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'executionTimeSummary' does not exist on ... Remove this comment to see the full error message
    const { executionTimeSummary, onCancel } = this.props;

    return (
      <div className="rc-CodeEvaluatorSlowProgressIndicator">
        <ProgressBar height="3px" width="100%" percentComplete={executionTimeSummary.getPercent(timeInMs)} />

        <div className="execution-step">
          <ConsoleOutput>{executionTimeSummary.getExecutionStep(timeInMs)}</ConsoleOutput>
        </div>

        <button className="button-link cancel-request" onClick={onCancel}>
          {_t('Cancel')}
        </button>
      </div>
    );
  }
}

export default CodeEvaluatorSlowProgressIndicator;
