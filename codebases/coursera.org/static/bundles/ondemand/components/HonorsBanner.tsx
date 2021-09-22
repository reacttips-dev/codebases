import _t from 'i18n!nls/ondemand';
import React from 'react';

import 'css!./__styles__/HonorsBanner';

type Props = {
  className: string;
};

export default class HonorsBanner extends React.Component<Props> {
  render() {
    return <div className={'rc-HonorsBanner body-2-text ' + this.props.className}>{_t('WITH HONORS')}</div>;
  }
}
