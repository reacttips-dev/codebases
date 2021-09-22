import PropTypes from 'prop-types';
import React from 'react';

import ReplHarnessEditor from 'bundles/author-code-evaluator/components/ReplHarnessEditor';
import TestCaseHarnessEditor from 'bundles/author-code-evaluator/components/TestCaseHarnessEditor';
import ReplHarness from 'bundles/author-code-evaluator/models/ReplHarness';
import TestCaseHarness from 'bundles/author-code-evaluator/models/TestCaseHarness';
import ExpressionHarness from 'bundles/author-code-evaluator/models/ExpressionHarness';
import { isMonacoEnabled } from 'bundles/cml/utils/FeatureUtils';

class HarnessEditor extends React.Component {
  static propTypes = {
    harness: PropTypes.instanceOf(ExpressionHarness),
    language: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  useMonacoEditor = isMonacoEnabled();

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'harness' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { harness } = this.props;

    if (harness instanceof ReplHarness) {
      return <ReplHarnessEditor useMonacoEditor={this.useMonacoEditor} {...this.props} />;
    } else if (harness instanceof TestCaseHarness) {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      return <TestCaseHarnessEditor useMonacoEditor={this.useMonacoEditor} {...this.props} />;
    }

    return null;
  }
}

export default HarnessEditor;
