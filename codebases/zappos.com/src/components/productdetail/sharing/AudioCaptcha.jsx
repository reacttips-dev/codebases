/* eslint-disable css-modules/no-unused-class */
import React, { Component } from 'react';
import cn from 'classnames';

import { MartyContext } from 'utils/context';

import css from 'styles/components/productdetail/captcha.scss';
export const AUDIO_CAPTCHA_ANSWER_LABEL_TEXT = 'Please type the numbers you hear';

export class AudioCaptcha extends Component {
  constructor(props) {
    super(props);
    this.captchaAnswerInput = React.createRef();
    this.audioElement = React.createRef();
  }

  state = { captchaAnswerInputValid: true };

  componentDidMount() {
    const { allowFocusOnAudioElement } = this.props;
    if (allowFocusOnAudioElement) {
      this.focusToAudioElement();
    }
  }

  componentDidUpdate(prevProps) {
    const { captcha, allowFocusOnAudioElement } = this.props;
    const { captcha: prevCaptcha } = prevProps;
    if (captcha !== prevCaptcha) {
      this.captchaAnswerInput.current.value = '';
      if (allowFocusOnAudioElement) {
        this.focusToAudioElement();
      }
    }
  }

  focusToAudioElement = () => {
    if (this.audioElement.current) {
      this.audioElement.current.focus();
    }
  };

  handleNewCaptchaRequested = () => {
    this.captchaAnswerInput.current.value = '';
    const { handleNewCaptchaRequested } = this.props;
    handleNewCaptchaRequested();
  };

  validateCaptchaAnswerInput = ({ currentTarget: { value } }) => {
    this.setState({ captchaAnswerInputValid: !!value });
  };

  render() {
    return (
      <MartyContext.Consumer>
        {({ testId }) => {
          const { captcha, getNewCaptchaLink, switchCaptchaLink } = this.props;
          const { audioToken, urlMp3, urlOgg, invalid } = captcha;
          const { captchaAnswerInputValid } = this.state;
          return (
            <div className={css.contentContainer}>
              <h3>Are You a Robot?</h3>
              <div className={css.captchaContainer}>
                <div>
                  <audio
                    controls
                    // This 'key' attribute is required to ensure the audio element reloads when a new captcha is requested
                    key={urlMp3}
                    ref={this.audioElement}>
                    <source name="srcMp3" src={urlMp3} type="audio/mpeg"/>
                    <source name="srcOgg" src={urlOgg} type="audio/ogg"/>
                  </audio>
                </div>
                <div className={css.captchaLinks}>
                  <div className={css.newCaptchaLink}>
                    {getNewCaptchaLink}
                  </div>
                  <div className={css.switchCaptchaLink}>
                    {switchCaptchaLink}
                  </div>
                </div>
              </div>
              <fieldset>
                <label
                  name="captchaAnswerLabel"
                  htmlFor="captchaAnswer"
                  className={cn({ [css.labelInvalid]: !captchaAnswerInputValid || invalid }, css.answerLabel)}>
                  {AUDIO_CAPTCHA_ANSWER_LABEL_TEXT}
                </label>
                <input
                  id="captchaAnswer"
                  type="text"
                  name="answer"
                  ref={this.captchaAnswerInput}
                  required
                  defaultValue=""
                  className={cn({ [css.invalid]: !captchaAnswerInputValid || invalid })}
                  onBlur={this.validateCaptchaAnswerInput}
                  data-test-id={testId('captchaInput')} />
                <input type="hidden" value={audioToken} name="token"/>
              </fieldset>
            </div>
          );
        }}
      </MartyContext.Consumer>
    );
  }
}

export default AudioCaptcha;
