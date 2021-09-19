/* eslint-disable css-modules/no-unused-class */
import React, { Component } from 'react';
import cn from 'classnames';

import { MartyContext } from 'utils/context';

import css from 'styles/components/productdetail/captcha.scss';
export const IMAGE_CAPTCHA_ANSWER_LABEL_TEXT = 'Please type the word you see above';

export class ImageCaptcha extends Component {
  constructor(props) {
    super(props);
    this.captchaAnswerInput = React.createRef();
  }

  state = { captchaAnswerInputValid: true };

  componentDidUpdate(prevProps) {
    const { captcha } = this.props;
    const { captcha: prevCaptcha } = prevProps;
    if (captcha !== prevCaptcha) {
      this.captchaAnswerInput.current.value = '';
    }
  }

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
          const { token, url, height, width, invalid } = captcha;
          const { captchaAnswerInputValid } = this.state;
          return (
            <div className={css.contentContainer}>
              <h3>Are You a Robot?</h3>
              <div className={css.captchaContainer}>
                <div>
                  <img
                    src={url}
                    height={height}
                    width={width}
                    alt="Captcha"/>
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
                  {IMAGE_CAPTCHA_ANSWER_LABEL_TEXT}
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
                <input type="hidden" value={token} name="token"/>
              </fieldset>
            </div>
          );
        }}
      </MartyContext.Consumer>
    );
  }
}

export default ImageCaptcha;
