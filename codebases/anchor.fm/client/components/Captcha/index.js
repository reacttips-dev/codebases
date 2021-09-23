import { css } from 'emotion';
import React from 'react';
import makeAsyncScriptLoader from 'react-async-script';
import ReCAPTCHA from 'react-google-recaptcha';

import { FieldController } from 'shared/FieldController';
import { Spinner } from 'shared/Spinner';

const V2_SITE_KEY = '6LdScnQUAAAAACG0AkA9z6gZtKmrL41amjeC9MJ0';
const V3_SITE_KEY = '6LfegKMUAAAAAPzD-KdrWDCBlz6l1zsXyHmiHcoG';

const V3_SCRIPT_URL = `https://www.google.com/recaptcha/api.js?render=${V3_SITE_KEY}&onload=onv3recaptchaloaded`;

const v3Captcha = () => <div />;

const V3WrappedCaptcha = makeAsyncScriptLoader(V3_SCRIPT_URL, {
  callbackName: 'onv3recaptchaloaded',
  globalName: 'grecaptcha',
})(v3Captcha);

export class Captcha extends React.Component {
  state = {
    isCaptchaLoading: true,
  };

  onV3CaptchaLoaded = () => {
    const _this = this;
    if (window.grecaptcha) {
      window.grecaptcha
        .execute(V3_SITE_KEY, { action: 'uploadVoiceMessage' })
        .then(v3Token => {
          _this.props.onChange(v3Token);
        });
    }
  };

  componentWillUnmount() {
    if (window.grecaptcha) {
      // hide the ugly badge (added dynamically by google js)
      const badgeEl = document.querySelector('.grecaptcha-badge');
      if (badgeEl) {
        badgeEl.remove();
      }
    }
  }

  render() {
    const { isV3, error, onBlur, onChange } = this.props;
    const { isCaptchaLoading } = this.state;
    const captchaProps = {
      asyncScriptOnLoad: () => this.setState({ isCaptchaLoading: false }),
      sitekey: V2_SITE_KEY,
      onChange: value => {
        onChange(value);
        // Triggers React Hook Form validation
        if (onBlur) onBlur(value);
      },
    };

    if (isV3) {
      return <V3WrappedCaptcha asyncScriptOnLoad={this.onV3CaptchaLoaded} />;
    }

    return (
      <div
        className={css`
          min-height: 78px;
          div {
            margin: 0 auto;
          }
        `}
      >
        {isCaptchaLoading && (
          <div
            className={css`
              padding-top: 20px;
            `}
          >
            <Spinner size={32} />
          </div>
        )}
        <ReCAPTCHA {...captchaProps} />
        {error && (
          <div
            className={css`
              color: #d0021b;
              font-size: 1.4rem;
              line-height: 1.8rem;
              width: 304px;
            `}
          >
            {error.message}
          </div>
        )}
      </div>
    );
  }
}

export const ControlledCaptcha = props => (
  <FieldController as={Captcha} {...props} />
);
