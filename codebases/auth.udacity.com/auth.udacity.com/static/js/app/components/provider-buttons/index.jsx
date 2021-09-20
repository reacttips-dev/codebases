import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { config } from 'config';
import { __ } from '../../../services/localization-service';

import Providers from '../../constants/social-providers';
import ProviderButton from './_provider-button';
import { SIGN_IN, SIGN_UP } from '../../constants/sign-x';
import styles from './index.module.scss';

export default class ProviderButtons extends Component {
  static propTypes = {
    next: PropTypes.string.isRequired,
    type: PropTypes.oneOf([SIGN_UP, SIGN_IN]).isRequired,
    providers: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    provider: '',
  };

  _isSignUp() {
    return this.props.type === SIGN_UP;
  }

  _getUrl() {
    return `${config.USER_API_URL}/oauth/${
      this._isSignUp() ? 'signup' : 'signin'
    }`;
  }

  _getProviderLabel(provider) {
    switch (provider) {
      case Providers.FACEBOOK:
        return 'Facebook';
      case Providers.GOOGLE:
        return 'Google';
      default:
        return '';
    }
  }

  handleProviderClick = (provider) => {
    return this.setState({ provider }, () => this.refs.providerForm.submit());
  };

  render() {
    let { provider } = this.state;

    let { next, providers } = this.props;

    return (
      <div>
        <form method="post" action={this._getUrl()} ref="providerForm">
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="provider" value={provider} />
        </form>

        <div className={styles.buttons}>
          {providers.map((provider) => {
            const providerLabel = this._getProviderLabel(provider);
            const i18nKey = this._isSignUp()
              ? 'Sign up with <%= provider %>'
              : 'Sign in with <%= provider %>';
            const label = __(i18nKey, { provider: providerLabel });
            return (
              <ProviderButton
                key={provider}
                onClick={this.handleProviderClick}
                provider={provider}
                label={label}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
