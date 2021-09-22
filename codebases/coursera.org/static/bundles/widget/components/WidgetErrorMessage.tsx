import React from 'react';

import _t from 'i18n!nls/widget';

import 'css!./__styles__/WidgetErrorMessage';

import type { WidgetError } from 'bundles/widget/reducers/WidgetManagerReducer';

type Props = {
  error: WidgetError;
};

class WidgetErrorMessage extends React.Component<Props> {
  render() {
    return (
      <div className="rc-WidgetErrorMessage vertical-box align-items-absolute-center">
        <span className="error-text">
          {_t('This item is provided by a 3rd party developer and cannot be accessed right now.')}
        </span>
        <a className="retry-link link-button">{_t('Retry')}</a>
      </div>
    );
  }
}

export default WidgetErrorMessage;
