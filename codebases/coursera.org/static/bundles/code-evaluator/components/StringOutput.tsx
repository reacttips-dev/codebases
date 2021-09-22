import type { StringOutputContents } from 'bundles/code-evaluator/models/EvaluationResponse';

import React from 'react';
import _t from 'i18n!nls/code-evaluator';

import ConsoleOutput from 'bundles/code-evaluator/components/ConsoleOutput';

import 'css!./__styles__/StringOutput';

class StringOutput extends React.Component<{
  output: StringOutputContents;
}> {
  render() {
    return (
      <div className="rc-StringOutput">
        <ConsoleOutput>
          {this.props.output.message ? (
            <div className="color-secondary-dark-text">{this.props.output.message}</div>
          ) : (
            <div className="color-hint-text">{_t('No Output')}</div>
          )}
        </ConsoleOutput>
      </div>
    );
  }
}

export default StringOutput;
