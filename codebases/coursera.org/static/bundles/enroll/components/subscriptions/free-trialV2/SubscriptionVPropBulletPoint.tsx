import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CheckIcon } from '@coursera/cds-icons';

import Icon from 'bundles/iconfont/Icon';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import 'css!./__styles__/SubscriptionVPropBulletPoint';

export type PropsFromCaller = {
  highlightHeader?: boolean;
  header: string;
  subheader?: string;
  messageProps?: Record<string, string | JSX.Element>;
};

class SubscriptionVPropBulletPoint extends React.Component<PropsFromCaller> {
  static contextTypes = {
    enableIntegratedOnboarding: PropTypes.bool,
  };

  renderHeader() {
    const { highlightHeader, header, messageProps } = this.props;

    if (highlightHeader) {
      return (
        <strong>
          <FormattedMessage message={header} {...messageProps} />
        </strong>
      );
    } else {
      return <FormattedMessage message={header} {...messageProps} />;
    }
  }

  render() {
    const { subheader } = this.props;
    const { enableIntegratedOnboarding } = this.context;

    const wrapperClassNames = classNames(
      { 'rc-SubscriptionVPropBulletPoint': !enableIntegratedOnboarding },
      { 'rc-SubscriptionVPropBulletPointExp': enableIntegratedOnboarding },
      'horziontal-box'
    );

    return (
      <div className={wrapperClassNames}>
        <div className="flex-1">
          {enableIntegratedOnboarding ? (
            <CheckIcon size="large" name="checkmark" className="check-icon" />
          ) : (
            <Icon name="checkmark" className="color-primary" />
          )}
        </div>
        <div className="flex-11 text-container">
          <div className="headline-1-text header">{this.renderHeader()}</div>
          <div className="body-1-text subheader">{subheader}</div>
        </div>
      </div>
    );
  }
}

export default SubscriptionVPropBulletPoint;
