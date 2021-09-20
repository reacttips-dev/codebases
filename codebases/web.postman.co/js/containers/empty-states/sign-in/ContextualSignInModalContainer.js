import React, { Component } from 'react';
import { Modal, ModalContent } from '../../../components/base/Modals';
import ContextualSignInModal from '../../../components/empty-states/ContextualSignInModal';
import { observer } from 'mobx-react';
import { attachAuthEventHandler, attachSyncEventHandler } from '../../../modules/services/SignInModalService';
import AuthHandlerService from '../../../modules/services/AuthHandlerService';
import * as SignInEmptyStateService from '../../../modules/services/SignInEmptyStateService';
import AnalyticsService from '../../../modules/services/AnalyticsService';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import { getAllParams } from '../../../../onboarding/src/common/UTMService';
const initialState = {
  type: 'invite',
  subtitle: '',
  carouselTitle: '',
  carouselData: [],
  learnMoreText: '',
  learnMoreLink: '',
  hasLargeContent: false,
  isOpen: false,
  isBackEnabled: false,
  loadingState: 'disabled',
  showDelayedError: false,
  isCloseEnabled: true,
  onBack: null,
  onLogin: null
};

@observer
export default class ContextualSignInModalContainer extends Component {
  constructor (props) {
    super(props);
    this.state = { ...initialState };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleLearnMore = this.handleLearnMore.bind(this);
    this.attachEventHandlers = this.attachEventHandlers.bind(this);

    this.handleSkip = this.handleSkip.bind(this);
    this.handleSyncError = this.handleSyncError.bind(this);
    this.handleAuthenticated = this.handleAuthenticated.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showContextualSignInModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showContextualSignInModal', this.handleOpen);
  }

  /**
   * The user chose to skip the authentication flow
   * Stop the loading state
   */
  handleSkip () {
    this.setState({
      loadingState: 'disabled',
      isCloseEnabled: true
    });
  }

  /**
   * Called when sync connect times out
   * Sets the error state
   */
  handleSyncError () {
    this.setState({
      loadingState: 'error',
      isCloseEnabled: true
    });
  }

  /**
   * Called when the user signs in
   * Attaches sync event handler
   */
  handleAuthenticated () {
    this.disposeSyncEventHandler = attachSyncEventHandler({
      onSuccess: () => {
        this.state.onLogin();
        this.handleClose();
      },
      onError: this.handleSyncError
    });
  }

  attachEventHandlers () {
    this.disposeAuthEventHandlers = attachAuthEventHandler({
      onSignIn: this.handleAuthenticated,
      onSkipSignIn: this.handleSkip
    });
  }

  handleOpen (opts = {}) {
    let data = SignInEmptyStateService.getEmptyStateDataForType(opts.type);

    this.sendModalOpenEvent(opts.type, opts.from);

    this.setState({
      ...data,
      ...opts,
      isBackEnabled: _.isFunction(opts.onBack),
      isOpen: true
    }, this.attachEventHandlers);
  }

  sendModalOpenEvent (type = 'generic', origin = 'sign_in') {
    let label = `${origin}_empty_state`;
    AnalyticsService.addEvent(type, 'sign_in_modal_opened', label);
  }

  handleClose () {
    // Dispose the event handlers that were attached before
    _.invoke(this, 'disposeAuthEventHandlers');
    _.invoke(this, 'disposeSyncEventHandler');


    // Reset the state back to the initial state
    this.setState(initialState);
  }

  handleBack () {
    // Call the callback if it was provided
    _.invoke(this.state, 'onBack');

    // Close the modal and get it back to initial state
    this.handleClose();
  }

  handleAuth (isSignup) {
    this.setState({
      loadingState: 'loading',
      isCloseEnabled: false
    });

    let action = isSignup ? 'initiate_create' : 'initiate_signin',
      label = `${this.state.from}_${this.state.type}_empty_state`,
      utmParams = getAllParams({
        utm_content: 'contextual_sign_in_modal',
        utm_term: isSignup ? 'sign_up' : 'sign_in'
      });

    AnalyticsService.addEvent(this.state.type, action, label);
    AuthHandlerService.initiateLogin({ isSignup, queryParams: utmParams });
  }

  handleLearnMore () {
    this.state.learnMoreLink && openExternalLink(this.state.learnMoreLink);
  }

  getStyles () {
    return {
      marginTop: '10vh',
      height: '75vh',
      minWidth: '760px',
      maxHeight: '570px',
      width: '80vw'
    };
  }

  getLoadingText () {
    switch (this.state.loadingState) {
      case 'loading': return 'Please Wait...';
      case 'error':
        return (
          <div>Something isn’t right.<br />Please close the modal and try later.</div>
        );
      default: return 'Please Wait...';
    }
  }

  isLoading () {
    return ['loading', 'error'].includes(this.state.loadingState);
  }

  render () {
    return (
      <Modal
        className='contextual-sign-in-modal-container'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getStyles()}
      >
        <ModalContent>
          {
            this.isLoading() &&
              <div className='contextual-sign-in-modal-container-loading'>
                <div className='loader' />
                <div className='loading-text'>{this.getLoadingText()}</div>
              </div>
          }
          <ContextualSignInModal
            {
              ..._.pick(this.state,
                [
                  'type',
                  'subtitle',
                  'carouselTitle',
                  'carouselData',
                  'learnMoreText',
                  'hasLargeContent',
                  'isBackEnabled',
                  'isCloseEnabled'
                ]
              )
            }
            onBack={this.handleBack}
            onClose={this.handleClose}
            onCreateAccount={this.handleAuth.bind(this, true)}
            onSignIn={this.handleAuth.bind(this, false)}
            onLearnMore={this.handleLearnMore}
          />
        </ModalContent>
      </Modal>
    );
  }
}
