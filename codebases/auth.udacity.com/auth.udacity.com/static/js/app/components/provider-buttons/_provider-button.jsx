import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@udacity/veritas-components';
import Providers from '../../constants/social-providers';
import { ReactComponent as FacebookLogo } from '../../../assets/images/facebook_logo.svg';
import { ReactComponent as GoogleLogo } from '../../../assets/images/google_logo.svg';
import styles from './_provider-button.module.scss';

export default class ProviderButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    provider: PropTypes.oneOf([Providers.GOOGLE, Providers.FACEBOOK])
      .isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {
    label: null,
  };

  _getLogo(provider) {
    switch (provider) {
      case Providers.FACEBOOK:
        return (
          <Icon title={provider}>
            <FacebookLogo />
          </Icon>
        );
      case Providers.GOOGLE:
        return (
          <Icon title={provider}>
            <GoogleLogo />
          </Icon>
        );
      default:
        return null;
    }
  }

  render() {
    const { onClick, label, provider } = this.props;

    return (
      <div className={styles['provider-button']}>
        <div className={styles['button-wrapper--lowercase']}>
          <Button
            full
            icon={this._getLogo(provider)}
            label={label}
            onClick={() => onClick(provider)}
            variant="minimal"
          />
        </div>
      </div>
    );
  }
}
