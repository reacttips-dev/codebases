import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { CLOSED_LA_COOKIE } from 'constants/cookies';
import { inIframe } from 'helpers/CheckoutUtils';
import { onCloseLoginAssistantClick, onLoginFromLoginAssistantClick, onRedirectFromLoginAssistantClick, onShowLoginAssistant } from 'store/ducks/loginAssistant/actions';
import llamaImage from 'images/llama-circle.svg';
import HtmlToReact from 'components/common/HtmlToReact';

import css from 'styles/components/loginAssistant.scss';
import { close as modalClose } from 'styles/components/common/modal.scss';

export class LoginAssistant extends Component {
  state = {
    isShown: true,
    isMounted: false
  };

  componentDidMount() {
    const { marketplace: { showLoginAssistant } } = this.context;
    const { hideLADueToCustomerClosedIt, isRecognizedCustomer, onShowLoginAssistant } = this.props;
    this.setState({ isMounted: true });

    if (showLoginAssistant && !hideLADueToCustomerClosedIt && !isRecognizedCustomer) {
      onShowLoginAssistant();
    }
  }

  onHideLoginAssistantFromLinkClick = buttonText => {
    this.setState({ isShown: false });
    this.props.onCloseLoginAssistantClick(buttonText);
  };

  onCtaClick = e => {
    e.preventDefault();

    const {
      content: {
        ctaType,
        ctaLink
      } = {},
      locationBeforeTransitions: { pathname },
      onLoginFromLoginAssistantClick,
      onRedirectFromLoginAssistantClick
    } = this.props;
    if (ctaType === 'login') {
      this.setState({ isShown: false });
      onLoginFromLoginAssistantClick(e.target.innerText, pathname);
    } else {
      onRedirectFromLoginAssistantClick(e.target.innerText, ctaLink);
    }
  };

  render() {
    const { marketplace: { showLoginAssistant }, testId } = this.context;
    if (!showLoginAssistant || inIframe()) {
      return null;
    }

    const {
      content,
      hideLADueToCustomerClosedIt,
      isRecognizedCustomer
    } = this.props;

    const {
      headerContent,
      bubbleContent,
      ctaText
    } = content || {};

    const { isShown, isMounted } = this.state;

    if ((isShown && hideLADueToCustomerClosedIt) || isRecognizedCustomer || !content || !isMounted) {
      return null;
    }

    return (
      <aside
        data-test-id={testId('loginAssistant')}
        className={cn(css.wrapper, { [css.fadeOut]: !isShown })}
        role="dialog">
        <div className={css.modalHeader}>
          <p className={css.header}>
            {headerContent}
          </p>
          <button
            type="button"
            onClick={() => this.onHideLoginAssistantFromLinkClick('X')}
            className={modalClose}
            data-test-id={testId('closeModal')}
            aria-label="Close" />
        </div>

        <div className={css.lasBody}>
          <div className={css.speechBubble}>
            <HtmlToReact noContainer={true}>{bubbleContent}</HtmlToReact>
          </div>
          <img src={llamaImage} alt="" />
        </div>

        <div className={css.footer}>
          <form action={'tbd'} method="post">
            <button
              type="button"
              disabled={false}
              onClick={ evt => this.onHideLoginAssistantFromLinkClick(evt.target.innerText)}
              className={css.cancelBtn}
              data-test-id={testId('dismissBtn')}>Dismiss</button>

            {!!ctaText && <button
              type="submit"
              className={css.loginBtn}
              onClick={this.onCtaClick}
              data-test-id={testId('loginAssistantCta')}>{ctaText}</button>}
          </form>
        </div>
      </aside>
    );
  }
}

function mapStateToProps(state) {
  const {
    cookies: {
      ['x-main']: isRecognizedCustomer,
      [CLOSED_LA_COOKIE]: hideLADueToCustomerClosedIt
    },
    routing: { locationBeforeTransitions },
    headerFooter: { content: { Global: { slotData: { 'global-dialog': content } } } }
  } = state;

  return {
    isRecognizedCustomer: !!isRecognizedCustomer,
    hideLADueToCustomerClosedIt: !!hideLADueToCustomerClosedIt,
    locationBeforeTransitions,
    content
  };
}

LoginAssistant.contextTypes = {
  marketplace: PropTypes.object,
  testId: PropTypes.func
};

export default connect(mapStateToProps, {
  onCloseLoginAssistantClick,
  onLoginFromLoginAssistantClick,
  onRedirectFromLoginAssistantClick,
  onShowLoginAssistant
})(LoginAssistant);
