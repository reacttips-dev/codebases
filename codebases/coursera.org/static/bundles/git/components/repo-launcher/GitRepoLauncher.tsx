import React from 'react';
import URI from 'jsuri';
import { ApiButton, Box } from '@coursera/coursera-ui';
import Imgix from 'js/components/Imgix';
import type { ApiStatusType } from 'bundles/phoenix/components/ApiNotification';
import { API_BEFORE_SEND, API_IN_PROGRESS } from 'bundles/phoenix/components/ApiNotification';
import type {
  GitRepositoryLaunchRole,
  LaunchGitRepositoryResponse,
  LaunchGitRepositorySuccessResponse,
  LaunchGitRepositoryFailureResponse,
  LaunchGitRepositoryFailureNeedsAuthenticationResponse,
  LaunchGitRepositoryFailureHasPendingInvitationResponse,
} from 'bundles/git/utils/GitIntegrationsApiUtils';
import {
  launchGitRepository,
  launchGitRepositoryResponseGuards,
  launchGitRepositoryFailureResponseGuards,
} from 'bundles/git/utils/GitIntegrationsApiUtils';
import { createGitRepositoryLaunchStateValue, buildGitCommitUrl } from 'bundles/git/utils/GitIntegrationsUtils';
import { openNewTab, openNewTabWithSavedState } from 'bundles/course-integrations-callback/utils/IntegrationsUtils';
import PendingInvitationModal from 'bundles/git/components/repo-launcher/PendingInvitationModal';
import _t from 'i18n!nls/git';
import 'css!./__styles__/GitRepoLauncher';

import config from 'js/app/config';

const GITHUB_OCTOCAT_SRC = `${config.url.resource_assets}course-integrations/git/icons/GitHub-Mark-32px.png`;

const GITHUB_OCTOCAT_SRC_LIGHT = `${config.url.resource_assets}course-integrations/git/icons/GitHub-Mark-Light-32px.png`;

const GITHUB_LOGO_SRC = `${config.url.resource_assets}course-integrations/git/icons/GitHub_Logo.png`;

const GITHUB_LOGO_SRC_LIGHT = `${config.url.resource_assets}course-integrations/git/icons/GitHub_Logo_White.png`;

// TODO: Identify the error codes + details we will see here.
// TODO: This error structure should live somewhere super generic.
type ApiError = {
  errorCode: string;
  message: string;
  details: object;
  responseJSON: undefined;
};

type JQueryError = {
  responseJSON: ApiError;
};

type Props = {
  launchRole: GitRepositoryLaunchRole;
  courseId: string;
  itemId: string;
  repositoryId: string;
  learnerUserId: number;
  commitHash?: string;
  isDisabled?: boolean;
};

type State = {
  apiStatus: ApiStatusType;
  isButtonHovered: boolean;
  isButtonFocused: boolean;
  showPendingInvitationModal: boolean;
  invitationUrl?: string;
  error: string | undefined;
};

const INITIAL_API_STATUS = API_BEFORE_SEND;
const INITIAL_SHOW_PENDING_INVITATION_MODAL = false;
const INITIAL_INVITATION_URL: string | undefined = undefined;
const INITIAL_ERROR: string | undefined = undefined;
const RESET_STATE = {
  apiStatus: INITIAL_API_STATUS,
  showPendingInvitationModal: INITIAL_SHOW_PENDING_INVITATION_MODAL,
  invitationUrl: INITIAL_INVITATION_URL,
  error: INITIAL_ERROR,
};

class GitRepoLauncher extends React.Component<Props, State> {
  container: HTMLElement | null | undefined;

  state: State = {
    apiStatus: INITIAL_API_STATUS,
    isButtonHovered: false,
    isButtonFocused: false,
    showPendingInvitationModal: INITIAL_SHOW_PENDING_INVITATION_MODAL,
    invitationUrl: INITIAL_INVITATION_URL,
    error: INITIAL_ERROR,
  };

  /**
   * This is the top-level response handler for the launch call. This will forward off to other functions
   * based on the structure of the response.
   */
  handleLaunchGitRepository = (response: LaunchGitRepositoryResponse): void => {
    this.resetState().then(() => {
      if (launchGitRepositoryResponseGuards.isSuccess(response)) {
        return this.handleLaunchGitRepositorySuccess(response);
      } else if (launchGitRepositoryResponseGuards.isFailure(response)) {
        return this.handleLaunchGitRepositoryFailure(response);
      } else {
        return this.handleLaunchGitRepositoryUnknownError();
      }
    });
  };

  /**
   * The user is authenticated. Open the requested GitHub repository in a new tab.
   */
  handleLaunchGitRepositorySuccess = (response: LaunchGitRepositorySuccessResponse): void => {
    const { commitHash } = this.props;
    // We're not using `this.openNewTabWithSavedState` here because we've already authenticated.
    // Now we're just opening the repo URL in a new tab, so no need to save the auth state locally.
    const url = buildGitCommitUrl(response.definition.url, commitHash);
    const loginGuardedUrl = this.buildLoginGuardedUrl(url);
    this.openNewTab(loginGuardedUrl);
  };

  /**
   * There are a few different types of failures. This function is responsible for figuring out which type
   * of failure this is, and forwarding off to the appropriate handler.
   */
  handleLaunchGitRepositoryFailure = (response: LaunchGitRepositoryFailureResponse): void => {
    // Ugh, this reads terribly but at least it's type-safe...
    if (launchGitRepositoryFailureResponseGuards.isNeedsAuthentication(response)) {
      return this.handleLaunchGitRepositoryFailureNeedsAuthentication(response);
    } else if (launchGitRepositoryFailureResponseGuards.isHasPendingInvitation(response)) {
      return this.handleLaunchGitRepositoryFailureHasPendingInvitation(response);
    } else if (launchGitRepositoryFailureResponseGuards.isAccessDenied(response)) {
      return this.handleLaunchGitRepositoryFailureAccessDenied();
    } else {
      return this.handleLaunchGitRepositoryUnknownError();
    }
  };

  /**
   * The user needs to connect their coursera account with their GitHub account by going
   * through the authentication process.
   */
  handleLaunchGitRepositoryFailureNeedsAuthentication = (
    response: LaunchGitRepositoryFailureNeedsAuthenticationResponse
  ): void => {
    this.openNewTabWithSavedState(response.definition.alternateURL).then(() => {
      // The new tab has been closed.
      const { launchRole, courseId, itemId, repositoryId, learnerUserId } = this.props;

      // Don't allow the button to be clicked again while we're making another API call. The button
      // just makes this API call anyway.
      this.setState({ apiStatus: API_IN_PROGRESS });

      // The authentication tab has been closed. Make another launch attemp and, if successful, open
      // the repo in a new tab.
      launchGitRepository(launchRole, courseId, itemId, repositoryId, learnerUserId).then((newResponse) => {
        // Make the button clickable again regardless of the result of this API call.
        this.resetState();

        if (launchGitRepositoryResponseGuards.isSuccess(newResponse)) {
          // We're now at the authenticated and accepted state. Just open the repo immediately since
          // the user has already communicated that they wanted it to be opened by clicking the button.
          this.handleLaunchGitRepositorySuccess(newResponse);
        } else if (launchGitRepositoryResponseGuards.isFailure(newResponse)) {
          if (launchGitRepositoryFailureResponseGuards.isHasPendingInvitation(newResponse)) {
            // We're not at the pending invitation state. Open the invitation modal immediately.
            this.handleLaunchGitRepositoryFailureHasPendingInvitation(newResponse);
          }
        }
      }, this.handleApiError);
    });
  };

  /**
   * The user is authenticated with GitHub, but must accept the invitation to the requested
   * repo before they can access it. Open the invitations page in a new tab and present
   * the user with a fresh launch button after that tab is closed. For now, users must
   * click Launch again after accepting the invitation.
   */
  handleLaunchGitRepositoryFailureHasPendingInvitation = (
    response: LaunchGitRepositoryFailureHasPendingInvitationResponse
  ): void => {
    this.openPendingInvitationModal(response.definition.alternateURL);
  };

  /**
   * The user is authenticated with GitHub and does not have access to this repo.
   */
  handleLaunchGitRepositoryFailureAccessDenied = (): void => {
    this.handleLaunchGitRepositoryError(_t('Access denied'));
  };

  /**
   * An unknown error has occurred.
   */
  handleLaunchGitRepositoryUnknownError = (): void => {
    this.handleLaunchGitRepositoryError(_t('An unknown error has occurred'));
  };

  handleLaunchGitRepositoryError = (error: string): void => {
    this.resetState();
    this.setState({ error });
  };

  handleApiError = (error?: ApiError | JQueryError) => {
    if (!error) {
      // This should likely never happen, but it can't hurt to have this fallback.
      this.handleLaunchGitRepositoryUnknownError();
    } else if (error.responseJSON) {
      this.handleApiError(error.responseJSON);
      // `error` is likely a jQuery XHR object with a `responseJSON` value that is itself
      // an ApiError, so let's just call ourselves recursively with that value.
    } else if (error.errorCode && error.message) {
      // TODO: Handle errors individually per the error handling best practices.

      // We have both an error code and a message. We will often need both to have the full context,
      // e.g. `"errorCode":"git_launch_failed","message":"Unexpected error occurred."`
      // This is the most likely situation, assuming we've handled all error states properly
      // front to back.
      this.handleLaunchGitRepositoryError(`${error.message} (${error.errorCode})`);
    } else {
      // We've only got an error code or a message, or some other value entirely. This
      // isn't likely to happen.
      this.handleLaunchGitRepositoryError(error.message || error.errorCode || JSON.stringify(error));
    }
  };

  handleMouseOver = (): void => {
    this.setState({ isButtonHovered: true });
  };

  handleMouseOut = (): void => {
    this.setState({ isButtonHovered: false });
  };

  handleFocus = (): void => {
    this.setState({ isButtonFocused: true });
  };

  handleBlur = (): void => {
    this.setState({ isButtonFocused: false });
  };

  openInvitationPage = (): void => {
    const { invitationUrl } = this.state;

    if (invitationUrl) {
      const loginGuardedUrl = this.buildLoginGuardedUrl(invitationUrl);
      this.openNewTab(loginGuardedUrl);
    }

    this.closePendingInvitationModal();
  };

  openPendingInvitationModal(invitationUrl: string): void {
    this.setState({
      showPendingInvitationModal: true,
      invitationUrl,
    });
  }

  closePendingInvitationModal = (): void => {
    this.resetState();
    this.setState({
      showPendingInvitationModal: false,
      invitationUrl: undefined,
    });
  };

  /**
   * Called after successful launches (authentication, invitations page, and repo page).
   */
  resetState = (): Promise<void> => {
    return new Promise((resolve) => {
      this.blurButton();
      this.setState(RESET_STATE, resolve);
    });
  };

  /**
   * When the Launch button is clicked, we need to first make a call to the backend to see what state
   * the user's account is in. It will be in one of several states:
   *
   * 1. Already authenticated with GitHub, having gone through this process previously. (success)
   * 2. Not authenticated with GitHub. (failure + 'NEEDS_AUTHENTICATION')
   * 3. Authenticated with GitHub, but has not accepted the invitation to this repo. (failure + 'HAVE_PENDING_INVITATION')
   * 4. Authenticated with GitHub, but access to this repo has been denied. (failure + 'ACCESS_DENIED')
   */
  launchRepo = () => {
    const { launchRole, courseId, itemId, repositoryId, learnerUserId } = this.props;

    this.setState({ apiStatus: API_IN_PROGRESS });

    launchGitRepository(launchRole, courseId, itemId, repositoryId, learnerUserId)
      .then(this.handleLaunchGitRepository, this.handleApiError)
      .catch(this.handleApiError);
  };

  buildLoginGuardedUrl = (url: string) => {
    const uri = new URI('https://github.com/login').addQueryParam('return_to', url);
    return uri.toString();
  };

  openNewTab = async (url: string) => {
    // Reset the button state before opening the new tab so it is clickable again
    // without the new tab having to be closed.
    this.resetState();

    return openNewTab(url);
  };

  openNewTabWithSavedState = async (url: string) => {
    const { courseId, launchRole, repositoryId } = this.props;
    const stateValue = await createGitRepositoryLaunchStateValue(courseId, launchRole, repositoryId);

    // Reset the button state before opening the new tab so it is clickable again
    // without the new tab having to be closed.
    this.resetState();

    return openNewTabWithSavedState(url, stateValue);
  };

  // This is a HACK. ApiButton does not get a blur event normally because this button
  // opens a new tab before it gets the chance. This causes the icon to have the
  // "hoverColor" color always after clicking. I couldn't think of a way to do this without
  // hooking into the success event that opens the tab, and I don't believe it's worth
  // adding upstream anyway because it's not a very common usecase. Time may prove otherwise.
  blurButton = () => {
    const buttonElement = this.container && (this.container.childNodes[0] as HTMLButtonElement);

    if (!buttonElement) {
      return;
    }

    // Reset the hover/blur state of this component so we can show the default images.
    this.setState({ isButtonHovered: false, isButtonFocused: false });

    // Blur the element.
    buttonElement.blur();

    // Trigger a mouseout event so ApiButton will update its state.
    const mouseOutEvent = document.createEvent('Event');
    mouseOutEvent.initEvent('mouseout', true, true);
    buttonElement.dispatchEvent(mouseOutEvent);

    // Trigger a blur event so ApiButton will update its state.
    const blurEvent = document.createEvent('Event');
    blurEvent.initEvent('blur', true, true);
    buttonElement.dispatchEvent(blurEvent);
  };

  render() {
    const { isDisabled = false } = this.props;
    const { apiStatus, isButtonHovered, isButtonFocused, showPendingInvitationModal, error } = this.state;
    const showFocusStyle = isButtonHovered || isButtonFocused;

    return (
      <div
        className="rc-GitRepoLauncher"
        ref={(c) => {
          this.container = c;
        }}
      >
        <ApiButton
          onClick={this.launchRepo}
          apiStatus={apiStatus}
          apiStatusAttributesConfig={{
            label: {
              API_IN_PROGRESS: _t('Opening...'),
              API_SUCCESS: _t('Opened'),
              API_ERROR: _t('Error'),
            },
            disabled: {
              API_BEFORE_SEND: isDisabled,
              API_IN_PROGRESS: true,
              API_SUCCESS: true,
              API_ERROR: true,
            },
          }}
          htmlAttributes={{
            onMouseOver: this.handleMouseOver,
            onMouseOut: this.handleMouseOut,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
          }}
        >
          <Box flexDirection="row" className="github-logo-container">
            <Imgix src={showFocusStyle ? GITHUB_OCTOCAT_SRC_LIGHT : GITHUB_OCTOCAT_SRC} alt="" width={24} height={24} />
            <Imgix src={showFocusStyle ? GITHUB_LOGO_SRC_LIGHT : GITHUB_LOGO_SRC} alt="GitHub" height={24} />
          </Box>
        </ApiButton>

        {/* After clicking the launch button, the user may have to accept an invitation to the repo before continuing */}
        {showPendingInvitationModal && (
          <PendingInvitationModal
            onClose={this.closePendingInvitationModal}
            openInvitationPage={this.openInvitationPage}
          />
        )}

        {error && <div>{error}</div>}
      </div>
    );
  }
}

export default GitRepoLauncher;
