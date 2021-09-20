import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import UserSignOutModal from '../../components/user/UserSignOutModal';
import { createEvent, getEventData } from '../../modules/model-event';
import dispatchUserAction from '../../modules/pipelines/app-action';
import { getStore } from '../../stores/get-store';
import AnalyticsService from '../../modules/services/AnalyticsService';
import WorkspaceController from '../../modules/controllers/WorkspaceController';

@pureRender
export default class UserSignOutModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      isSessionExpired: false,
      acceptForceSignout: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.toggleSignoutCheck = this.toggleSignoutCheck.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showUserSignoutModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showUserSignoutModal', this.handleOpen);
  }

  handleOpen ({ isSessionExpired } = {}) {
    // if session expired dont show any warning or anything and show the state where user can directly log out
    if (isSessionExpired) {
      this.setState({
        isLoading: false,
        showWarning: false,
        acceptForceSignout: true,
        isOpen: true,
        isSessionExpired: isSessionExpired || false
      });

      return;
    }

    this.setState({
      isOpen: true,
      isLoading: false,
      acceptForceSignout: false,
      showWarning: false,
      isSessionExpired: isSessionExpired || false
    });

    AnalyticsService.addEvent('account', 'initiate_sign_out');
  }

  handleClose () {
    this.setState({
      isOpen: false,
      isSigningOut: false,
      acceptForceSignout: true
    });

    /**
     * If the user's auth session is expired, then go back to the `session expired modal`
     * https://github.com/postmanlabs/postman-app-support/issues/4859
     */
    if (this.state.isSessionExpired) {
      pm.mediator.trigger('startReenterPassword');
    }
  }

  handleConfirm () {
    let currentUser = getStore('CurrentUserStore'),
        logoutEvent = createEvent('logout', 'user', { id: currentUser.id });

    this.setState({ isSigningOut: true });

    dispatchUserAction(logoutEvent)
      .then(() => {
        this.handleClose();
      })
      .catch((e) => {
        pm.logger.warn('UserSignOutModalContainer~Error in logging out user ', e);

        this.setState({
          signInLoading: false,
          signInError: e, // @todo copy from vineeth
          isSigningOut: false,
          disableSignout: false,
          acceptForceSignout: true
        });
        this.handleClose();
      });
  }

  toggleSignoutCheck () {
    this.setState({
      acceptForceSignout: !this.state.acceptForceSignout
    });
  }

  render () {
    return (
      <UserSignOutModal
        isSigningOut={this.state.isSigningOut}
        showWarning={this.state.showWarning}
        toggleSignoutCheck={this.toggleSignoutCheck}
        isLoading={this.state.isLoading}
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onConfirm={this.handleConfirm}
        acceptForceSignout={this.state.acceptForceSignout}
      />
    );
  }
}
