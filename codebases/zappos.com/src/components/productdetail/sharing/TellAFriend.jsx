import { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import { initializeTellAFriendCaptcha, resetTellAFriend, sendTellAFriendEmail } from 'actions/productdetail/sharing';
import { VALID_EMAIL } from 'common/regex';
import MelodyModal from 'components/common/MelodyModal';
import TellAFriendImage from 'images/tell_a_friend_illustration.svg';
import { trackEvent } from 'helpers/analytics';
import Captcha from 'components/productdetail/sharing/Captcha';
import { pick } from 'helpers/lodashReplacement';
import { MartyContext } from 'utils/context';

import css from 'styles/components/productdetail/tellAFriend.scss';
const API_FIELDS = ['name', 'senderEmail', 'recipientEmail', 'message', 'productId', 'colorId'];
const ERROR_MESSAGE = 'Uh oh, looks like we\'ve encountered an error while sending your message.  This has been logged and we are working on a fix.';
const DONE_MESSAGE = 'Woohoo! Your message has been sent.';
const initialState = { nameValid: true, recipientEmailValid: true, senderEmailValid: true, hasSubmittedInvalid: false };

export class TellAFriend extends Component {
  state = initialState;

  componentDidMount() {
    const { isOpen, initializeTellAFriendCaptcha } = this.props;
    if (isOpen) {
      initializeTellAFriendCaptcha();
    }
  }

  componentDidUpdate({ isOpen: prevOpen }) {
    const { isOpen, initializeTellAFriendCaptcha } = this.props;
    if (isOpen && !prevOpen) {
      initializeTellAFriendCaptcha();
    }
  }

  close = e => {
    const { onClose, resetTellAFriend } = this.props;
    e && e.preventDefault();
    resetTellAFriend();
    onClose();
    this.setState(initialState);
  };

  send = e => {
    const { trackEvent, sendTellAFriendEmail } = this.props;
    const { nameValid, recipientEmailValid, senderEmailValid } = this.state;
    e.preventDefault();
    if (nameValid && recipientEmailValid && senderEmailValid) {
      const fields = pick(e.currentTarget, API_FIELDS);
      const data = {};
      Object.keys(fields).forEach(field => {
        data[field] = fields[field] && fields[field].value;
      });
      const captchaAnswer = {
        answer: e.currentTarget.answer.value,
        token: e.currentTarget.token.value
      };
      trackEvent('TE_PDP_TELLAFRIEND_SEND', `SKU:${data.productId}`);
      sendTellAFriendEmail(data, captchaAnswer);
    } else {
      this.setState({ hasSubmittedInvalid: true });
    }
  };

  validateEmail = ({ currentTarget: { value, name } }) => {
    this.setState({ [`${name}Valid`]: VALID_EMAIL.test(value) });
  };

  validateName = ({ currentTarget: { value } }) => {
    this.setState({ nameValid: !!value });
  };

  makeMessageContent(isSuccess) {
    return (
      <div className={css.messageContent}>
        <div className={cn({ [css.complete]: isSuccess, [css.error]: !isSuccess })}>{isSuccess ? DONE_MESSAGE : ERROR_MESSAGE}</div>
        <div className={css.clear} />
        <div className={css.actionBar}>
          <button type="button" onClick={this.close} className={css.doneButton}>Close</button>
        </div>

      </div>
    );
  }
  makeValidEmailMessage() {
    return (
      <div className={css.error}>Uh oh, please enter a valid <strong>email address</strong>.</div>
    );
  }

  handleNewCaptchaRequested = () => {
    const { isOpen, initializeTellAFriendCaptcha } = this.props;
    if (isOpen) {
      initializeTellAFriendCaptcha();
    }
  };

  makeCaptchaContent(captcha) {
    if (captcha) {
      return (
        <MartyContext.Consumer>
          {({ testId }) => (
            <div>
              <h3>Are You a Robot?</h3>
              <img
                src={captcha.url}
                height={captcha.height}
                width={captcha.width}
                alt="Captcha" />
              <fieldset>
                <label htmlFor="captchaAnswer" className={cn({ [css.labelInvalid]: captcha.invalid })}>Please type the word you see above</label>
                <input
                  id="captchaAnswer"
                  type="text"
                  name="answer"
                  required
                  className={cn({ [css.invalid]: captcha.invalid })}
                  data-test-id={testId('captchaInput')} />
                <input type="hidden" value={captcha.token} name="token"/>
              </fieldset>
            </div>
          )}
        </MartyContext.Consumer>
      );
    }
  }

  makeModalForm() {
    const { tellAFriend: { sending, captcha }, productId, colorId, isAudioCaptchaOption, hash } = this.props;
    const { nameValid, recipientEmailValid, senderEmailValid } = this.state;
    return (
      <MartyContext.Consumer>
        {({ testId }) => (
          <form method="post" onReset={this.close} onSubmit={this.send}>
            <div className={css.contentContainer}>
              <fieldset>
                <label htmlFor="tellAFriendYourName" className={cn({ [css.labelInvalid]: !nameValid })}>Your Name</label>
                <input
                  id="tellAFriendYourName"
                  name="name"
                  data-test-id={testId('yourName')}
                  required={true}
                  className={cn({ [css.invalid]: !nameValid })}
                  onBlur={this.validateName}/>
              </fieldset>
              <fieldset>
                <label htmlFor="tellAFriendYourEmail" className={cn({ [css.labelInvalid]: !senderEmailValid })}>Your Email</label>
                <input
                  id="tellAFriendYourEmail"
                  name="senderEmail"
                  data-test-id={testId('yourEmail')}
                  required={true}
                  className={cn({ [css.invalid]: !senderEmailValid })}
                  onBlur={this.validateEmail}/>
              </fieldset>
              <fieldset>
                <label htmlFor="recipientEmailValid" className={cn({ [css.labelInvalid]: !recipientEmailValid })}>Your Friend's Email</label>
                <input
                  id="recipientEmailValid"
                  name="recipientEmail"
                  data-test-id={testId('friendEmail')}
                  required={true}
                  className={cn({ [css.invalid]: !recipientEmailValid })}
                  onBlur={this.validateEmail}/>
              </fieldset>
              <fieldset>
                <label htmlFor="tellAFriendMessage">Add a personal message below (optional)</label>
                <textarea id="tellAFriendMessage" name="message" data-test-id={testId('message')}/>
              </fieldset>
              {isAudioCaptchaOption ?
                <Captcha
                  captcha={captcha}
                  handleNewCaptchaRequested={this.handleNewCaptchaRequested}
                  hash={hash}/>
                : this.makeCaptchaContent(captcha)}
              <input type="hidden" value={productId} name="productId"/>
              <input type="hidden" value={colorId} name="colorId"/>
            </div>
            <div className={css.actionBar}>
              <button
                type="reset"
                className={css.closeButton}
                disabled={sending}
                data-test-id={testId('cancel')}>
            Cancel
              </button>
              <button
                type="submit"
                className={css.sendButton}
                disabled={sending}
                data-test-id={testId('send')}>
                {sending ? 'Sending' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </MartyContext.Consumer>
    );
  }

  makeModalContent() {
    const { tellAFriend } = this.props;
    const { hasSubmittedInvalid, recipientEmailValid, senderEmailValid } = this.state;
    return (
      <MartyContext.Consumer>
        {({ testId }) => (
          <>
            {hasSubmittedInvalid && (!recipientEmailValid || !senderEmailValid) && this.makeValidEmailMessage()}
            {tellAFriend.captcha && tellAFriend.captcha.invalid && (<div className={css.error} data-test-id={testId('captchaErrorMessage')}>The captcha answer was incorrect.</div>)}
            <img src={TellAFriendImage} alt="Tell A Friend" className={css.imageFlair}/>
            {typeof tellAFriend.successfullySent === 'boolean' ? this.makeMessageContent(tellAFriend.successfullySent) : this.makeModalForm() }
          </>
        )}
      </MartyContext.Consumer>
    );
  }

  render() {
    const { isOpen } = this.props;
    return (
      <MelodyModal
        onRequestClose={this.close}
        isOpen={isOpen}
        heading="Tell a Friend!"
        className={css.modalContent}
        wrapperTestId="tellAFriendModal"
      >
        {this.makeModalContent()}
      </MelodyModal>
    );
  }
}

TellAFriend.defaultProps = {
  trackEvent
};

function mapStateToProps(state) {
  return {
    tellAFriend: state.sharing.tellAFriend,
    isAudioCaptchaOption: state.killswitch?.enableAudioCaptcha
  };
}
export default connect(mapStateToProps, {
  initializeTellAFriendCaptcha,
  resetTellAFriend,
  sendTellAFriendEmail
})(TellAFriend);
