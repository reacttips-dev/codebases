import React, { Component } from 'react';
import SignInModal from '../../../components/empty-states/SignInModal';
import { Modal, ModalHeader, ModalContent } from '../../../components/base/Modals';
import AuthHandlerService from '../../../modules/services/AuthHandlerService';
import AnalyticsService from '../../../modules/services/AnalyticsService';
import { attachAuthEventHandler } from '../../../modules/services/SignInModalService';
import { getAllParams } from '../../../../onboarding/src/common/UTMService';

const defaultState = {
  isOpen: false,
  origin: '',
  type: '',
  title: undefined,
  subtitle: undefined,
  renderIcon: undefined,
  continueUrl: ''
};

export default class SignInModalContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
     ...defaultState
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAuthSuccess = this.handleAuthSuccess.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showSignInModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showSignInModal', this.handleOpen);
  }

  handleOpen (opts = {}) {
    if (this.state.isOpen) {
      return;
    }

    this.sendModalOpenEvent(opts.type, opts.origin);

    this.setState({
      ...opts,
      isOpen: true
    }, () => {
      _.isFunction(this.state.onAuthentication) && this.handleAuthSuccess(this.state.onAuthentication);
    });
  }

  handleAuthSuccess (onAuthentication) {
    this.disposeAuthEventHandlers = attachAuthEventHandler({
      onSignIn: () => {
        onAuthentication();
        this.handleClose();
      }
    });
  }

  handleClose () {
    _.invoke(this, 'disposeAuthEventHandlers');
    this.state.isOpen && this.setState(defaultState);
  }

  handleAuth (isSignup) {
    this.setState({
      loadingState: 'loading',
      isCloseEnabled: false
    });

    let action = isSignup ? 'initiate_create' : 'initiate_signin',
      label = `${this.state.origin || 'generic_sign_in'}_empty_state`,
      utmParams = getAllParams({
        utm_content: 'generic_sign_in_modal',
        utm_term: isSignup ? 'sign_up' : 'sign_in'
      });

    AnalyticsService.addEvent(this.state.type, action, label);
    AuthHandlerService.initiateLogin({ isSignup, continueUrl: this.state.continueUrl, queryParams: utmParams });
  }

  sendModalOpenEvent (type = 'generic', origin = 'sign_in') {
    let label = `${origin}_empty_state`;
    AnalyticsService.addEvent(type, 'sign_in_modal_opened', label);
  }

  getStyles () {
    return {
      marginTop: '0px',
      height: '40vh',
      width: '40vw',
      minHeight: '400px',
      minWidth: '400px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  render () {
    return (
      <Modal
        className='sign-in-modal-container'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getStyles()}
      >
        <ModalHeader>
          CREATE AN ACCOUNT
        </ModalHeader>
        <ModalContent>
          <SignInModal
            subtitle={this.state.subtitle}
            title={this.state.title}
            renderIcon={this.state.renderIcon}
            onClose={this.handleClose}
            onCreateAccount={this.handleAuth.bind(this, true)}
            onSignIn={this.handleAuth.bind(this, false)}
          />
        </ModalContent>
      </Modal>
    );
  }
}
