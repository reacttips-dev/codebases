import React from 'react';
import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/LoadingIndicator';

class LoadingIndicator extends React.Component {
  render() {
    return <div className="rc-LoadingIndicator">{_t('Loading')}</div>;
  }
}

export default LoadingIndicator;
