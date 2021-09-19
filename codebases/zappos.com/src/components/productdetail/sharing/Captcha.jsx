/* eslint-disable css-modules/no-unused-class */
import React, { Component } from 'react';

import { MartyContext } from 'utils/context';
import AudioCaptcha from 'components/productdetail/sharing/AudioCaptcha';
import ImageCaptcha from 'components/productdetail/sharing/ImageCaptcha';

import css from 'styles/components/productdetail/captcha.scss';
export const IMAGE_CAPTCHA = 'imagecaptcha';
export const AUDIO_CAPTCHA = 'audiocaptcha';
export const IMAGE_CAPTCHA_ANSWER_LABEL_TEXT = 'Please type the word you see above';
export const AUDIO_CAPTCHA_ANSWER_LABEL_TEXT = 'Please type the numbers you hear';

export class Captcha extends Component {

  state = { captchaType: IMAGE_CAPTCHA, allowFocusOnAudioElement: false };

  componentDidMount() {
    const { captchaType } = this.state;
    const requestedCaptchaType = this.getAnchor();
    if (captchaType !== requestedCaptchaType) {
      this.setState({ captchaType: requestedCaptchaType });
    }
  }

  getAnchor() {
    const { hash } = this.props;
    return (hash?.includes('#')) ? hash.split('#')[1] : null;
  }

  makeSwitchToImageCaptchaLink() {
    return <a href={`#${IMAGE_CAPTCHA}`} onClick={this.handleChangeCaptchaTypeImage.bind(this)} className={css.link}>Change to Image Captcha</a>;
  }

  makeSwitchToAudioCaptchaLink() {
    return <a href={`#${AUDIO_CAPTCHA}`} onClick={this.handleChangeCaptchaTypeAudio.bind(this)} className={css.link}>Change to Audio Captcha</a>;
  }

  makeGetNewImageCaptchaLink() {
    return <a href={`#${IMAGE_CAPTCHA}`} onClick={this.handleNewCaptchaRequested.bind(this)} className={css.link}>Get a new Image Captcha</a>;
  }

  makeGetNewImageAudioLink() {
    return <a href={`#${AUDIO_CAPTCHA}`} onClick={this.handleNewCaptchaRequested.bind(this)} className={css.link}>Get a new Audio Captcha</a>;
  }

  handleChangeCaptchaTypeImage = () => {
    this.setState({ captchaType: IMAGE_CAPTCHA });
  };

  handleChangeCaptchaTypeAudio = () => {
    this.setState({ captchaType: AUDIO_CAPTCHA, allowFocusOnAudioElement: true });
  };

  handleNewCaptchaRequested = () => {
    const { handleNewCaptchaRequested } = this.props;
    handleNewCaptchaRequested();
    this.setState({ allowFocusOnAudioElement: true });
  };

  render() {
    return (
      <MartyContext.Consumer>
        { () => {
          const { captcha } = this.props;
          if (captcha) {
            const { captchaType, allowFocusOnAudioElement } = this.state;
            switch (captchaType) {
              case AUDIO_CAPTCHA:
                return (
                  <>
                  {<AudioCaptcha
                    captcha={captcha}
                    getNewCaptchaLink={this.makeGetNewImageAudioLink()}
                    switchCaptchaLink={this.makeSwitchToImageCaptchaLink()}
                    allowFocusOnAudioElement={allowFocusOnAudioElement}/>}
                  </>
                );
              case IMAGE_CAPTCHA:
              default:
                return (
                  <>
                  {<ImageCaptcha
                    captcha={captcha}
                    getNewCaptchaLink={this.makeGetNewImageCaptchaLink()}
                    switchCaptchaLink={this.makeSwitchToAudioCaptchaLink()}/>}
                  </>
                );
            }
          }
        }}
      </MartyContext.Consumer>
    );
  }
}

export default Captcha;
