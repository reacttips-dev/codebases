import React from 'react';
import ConsoleOutput from 'bundles/code-evaluator/components/ConsoleOutput';
import _t from 'i18n!nls/code-evaluator';
import 'css!./__styles__/RequestError';

class RequestError extends React.Component {
  render() {
    return (
      <div className="rc-RequestError">
        <ConsoleOutput>{_t('Request error logged. Please try again later.')}</ConsoleOutput>
      </div>
    );
  }
}

export default RequestError;
