import React, { Component } from 'react';
import UserInvalidSessionModal from '../../components/user/UserInvalidSessionModal';
import { getStore } from '../../stores/get-store';
import dispatchUserAction from '../../modules/pipelines/app-action';
import { createEvent } from '../../modules/model-event';
import pureRender from 'pure-render-decorator';
import AuthHandlerService from '../../modules/services/AuthHandlerService';
import AnalyticsService from '../../modules/services/AnalyticsService';
import HttpService from '../../utils/HttpService';
import { addParamsToUrl } from '../../common/utils/url';
import UserController from '../../modules/controllers/UserController';

const COOLDOWN_MIN_MS = 15 * 1000, // Wait at least this much time before contacting Identity again
      COOLDOWN_MAX_MS = 60 * 1000, // Wait at most this much time before contacting Identity again
      COOLDOWN_WINDOW_MS = COOLDOWN_MAX_MS - COOLDOWN_MIN_MS;

@pureRender
export default class UserInvalidSessionModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,

      // Are we waiting on a response from Identity?
      validationInProgress: false,

      // Are we holding off from sending unnecessary calls to prevent loading the backend services? The
      // actual cooldown period is tracked separately from the throttle because while we know that we only
      // need to check once per MIN cooldown period, the actual period can vary and checks between MIN
      // and MAX will be short-circuited by other states which are being tracked.
      cooldown: false,

      // Have we already verified the invalidation once?
      invalidated: false
    };

    this.cooldown = this.cooldown.bind(this);
    this.validateSession = this.validateSession.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleOpenIntent = this.handleOpenIntent.bind(this);
    this.handleClose = this.handleClose.bind(this);

    // Bind web and app handlers based on the platform
    if (window.SDK_PLATFORM === 'browser') {
      this.handleSignIn = this.handleSignInWeb.bind(this);
      this.handleSignOut = this.handleSignOutWeb.bind(this);
    }
    else {
      this.handleSignIn = this.handleSignInApp.bind(this);
      this.handleSignOut = this.handleSignOutApp.bind(this);
    }

    /**
     * every time whenever there is a successful log in, then close
     * the session expired modal if its already open.
     *
     * There may be pending requests which have got executed later and
     * might have triggered this modal when the requester window was hidden
     */
    pm.eventBus.channel('auth-handler-events').subscribe((event) => {
      if (event && event.name === 'authenticated' && event.namespace === 'authentication') {
        this.handleClose && this.handleClose();
      }
    });
  }

  UNSAFE_componentWillMount () {
    pm.logger.info('SessionValidation - Registering listener');
    pm.mediator.on('startReenterPassword', this.handleOpenIntent);

    // check if the current session is already locked
    // if the session is locked, the same event for showing this modal
    // (pm.mediator.trigger('startReenterPassword')) will be triggered
    pm.eventBus.channel('user-session-management').publish(createEvent('isSessionLocked', 'sessionManagement'));
  }

  componentWillUnmount () {
    pm.logger.info('SessionValidation - De-registering listener');
    pm.mediator.off('startReenterPassword', this.handleOpenIntent);
  }

  /**
   * Handle the intent to open this modal. Having this step in between, and treating this invocation as
   * an intent rather than an action allows us to take control of when this modal is displayed rather
   * than completely delegating that control to the caller.
   */
  handleOpenIntent () {
    pm.logger.info('SessionValidation - Intent received');
    AnalyticsService.addEventV2({
      category: 'identity',
      action: 'lock_session',
      label: 'intent'
    });

    if (this.state.isOpen) {
      // The modal is already open. There's nothing meaningful we can do here.
      pm.logger.info('SessionValidation - Modal already open');
      AnalyticsService.addEventV2({
        category: 'identity',
        action: 'lock_session',
        label: 'bail_modal_open'
      });

      return;
    }

    if (this.state.validationInProgress) {
      // We're already waiting on a response from Identity verifying the validity of this session,
      // there's no need to send another request.
      pm.logger.info('SessionValidation - Validation already in progress');
      AnalyticsService.addEventV2({
        category: 'identity',
        action: 'lock_session',
        label: 'bail_in_progress'
      });

      return;
    }

    if (this.state.cooldown) {
      // We're already offline because we've disconnected the socket already and are on cooldown. If this
      // intent is expressed at this point, it's because of a request coming in from a non-sync flow. Since
      // we're already in cooldown, we don't need to send out another request unnecessarily to check again.
      pm.logger.info('SessionValidation~cooldown - Application is already offline');
      AnalyticsService.addEventV2({
        category: 'identity',
        action: 'lock_session',
        label: 'bail_offline'
      });

      return;
    }

    if (this.state.invalidated) {
      // We've already verified that the session is invalid, we don't need to check again and the user should
      // definitely sign in again.
      pm.logger.info('SessionValidation - Session has already been verified as invalid');
      AnalyticsService.addEventV2({
        category: 'identity',
        action: 'lock_session',
        label: 'already_invalid'
      });

      return this.handleOpen();
    }

    // If we've reached this point, then we need to load the session validity from Identity.
    this.validateSession();
  }

  /**
   * To avoid cases where we show this modal as a false alarm, this component will take steps to verify
   * that the user session has indeed expired before actually displaying this blocking modal.
   */
  validateSession () {
    pm.logger.info(`SessionValidation - Validation starting (${pm.identityApiUrl})`);
    AnalyticsService.addEventV2({
      category: 'identity',
      action: 'lock_session',
      label: 'start_validation'
    });
    this.setState({ validationInProgress: true });

    // Send request to Identity directly using XHR, using the access token to fetch the current session
    // If the session was fetched and is valid, then we disconnect the socket for some time to avoid a
    // barrage of requests hitting Identity. The syncing logic at the time of writing drops a changeset if
    // the request to Sync fails (with some retry built in). If we don't disconnect the socket, we'll end
    // with a string of failed requests and a string of dropped changesets. To avoid this, we'll disconnect
    // the socket for some time and reconnect the socket when it's likely that load issues on Identity/Sync
    // have subsided. But we log it in case that helps with debugging later. If the session actually turns
    // out to be invalid, then we throw the modal.
    let headers = { 'x-access-token': _.get(getStore('CurrentUserStore'), 'auth.access_token') },
      options = { headers };

    HttpService.request(`${pm.identityApiUrl}/api/sessions/current`, options)
      .then(({ body, status }) => {
        pm.logger.info(`SessionValidation - Response received (${status})`);
      })
      .catch((error) => {
        let status = _.get(error, 'status');

        pm.logger.info(`SessionValidation - Request error (${status})`);

        if (status === 401) {
          // This is the only case where we know for a fact that the session is invalid, so we can go ahead
          // and show the modal.
          pm.logger.info('SessionValidation - Session invalidity confirmed. Opening modal.');
          AnalyticsService.addEventV2({
            category: 'identity',
            action: 'lock_session',
            label: 'session_invalidated'
          });

          this.setState({ invalidated: true });

          return this.handleOpen();
        }
      })
      .finally(() => {
        this.setState({ validationInProgress: false });

        if (!this.state.isOpen) {
          // If the modal hasn't been opened by the time we reach here, something has gone wrong and we need to
          // disconnect the socket to prevent data loss. If we don't disconnect the socket, the current changeset
          // sync which triggered this change will get dropped and the next changeset will attempt to sync. That
          // will also fail for the same reason, causing that to be dropped as well. This will continue until all
          // changesets are dropped. To prevent this, we'll keep the socket disconnected for some time so that
          // the system can recover (hopefully?) by the next time the socket reconnects.
          let cooldown = this.cooldown(),
            cooldownSeconds = Math.floor(cooldown / 1000);

          pm.logger.error('SessionValidation - Session expiry hint validated as incorrect, '
            + `disconnecting socket for ~${cooldownSeconds} seconds`);
          pm.mediator.trigger('appOffline');
          AnalyticsService.addEventV2({
            category: 'identity',
            action: 'lock_session',
            label: 'socket_disconnected'
          });
          this.setState({ cooldown: true });

          // Reconnect after some time to check again. The time we wait before reconnecting is spread out over
          // some period to avoid concurrent reconnects from all the apps in the wild.
          setTimeout(() => {
            pm.logger.info(`SessionValidation - Waited ~${cooldownSeconds} seconds. Reconnecting socket.`);
            pm.mediator.trigger('appOnline');
            AnalyticsService.addEventV2({
              category: 'identity',
              action: 'lock_session',
              label: 'socket_reconnected'
            });
            this.setState({ cooldown: false });
          }, cooldown);
        }
      });
  }

  handleOpen () {
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });
  }

  /**
   * Handle SignIn for expired sessions on web
   * Triggered when user select `SignIn` option on session expiry modal, on web
   */
  async handleSignInWeb () {
    let currentUser = await UserController.get();

    // Redirecting user back to identity, with "continue" Url as `https://go.postman.co' appending current path
    // if user is on "/build/workspace/{workspaceId}", then after signIn, user will land on the same path
    // the `reAuthenticate` flag will tell identity to only allow user to sign in with the given email in query param
    // and the dashboardUrl with current path will land the user back to same URL that the user is on currently
    window.location.assign(

      // URL ex : https://identity.getpostman.com?email=t@g.co&reAuthenticate=1&continue=https://go.postman-beta.co/build/workspace-f23f3
      addParamsToUrl(pm.identityUrl, {
        reAuthenticate: 1,
        email: currentUser.email,
        continue: `${pm.dashboardUrl}${window.location.pathname}`
      })
    );
    this.handleClose();
  }

  /**
   * Handle SignIn for expired sessions on web
   * Triggered when user selects `SignIn` on session expiry modal. on Desktop App
   */
  handleSignInApp () {
    AuthHandlerService.reAuthenticate();
    this.handleClose();
  }

  handleSignOutWeb () {
    // if the user is signing out on web, we just want to redirect back to identity.
    // whenever user logs back in to any account, identity will set a new cookie
    // On web, there's no need to trigger the SignOut Modal, since it's not releavant until we preserve unsaved data
    window.location.assign(pm.identityUrl);
    this.handleClose();
  }

  handleSignOutApp () {
    pm.mediator.trigger('showUserSignoutModal', { isSessionExpired: true });
    this.handleClose();
  }

  /**
   * Rather than having a backoff logic, which would complicate this flow further and probably cause bugs,
   * we can spread out the removal of the cooldown in a pseudo-random manner using the configured cooldown
   * MIN & MAX times. We're okay with using Math.random here since our intent here is not to generate
   * a cooldown time that's cryptographically secure, rather simply spread out over the MIN & MAX times.
   *
   * @return {Number} The cooldown time in milliseconds
   */
  cooldown () {
    return Math.round(Math.random() * COOLDOWN_WINDOW_MS + COOLDOWN_MIN_MS);
  }

  render () {
    return (
      <UserInvalidSessionModal
        isOpen={this.state.isOpen}
        onSignIn={this.handleSignIn}
        onSignOut={this.handleSignOut}
      />
    );
  }
}
