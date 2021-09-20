import '@udacity/veritas-styles/dist/index.css';

import { Button, Text } from '@udacity/veritas-components';

import AuthenticationService from 'services/authentication-service';
import ClassroomPropTypes from 'components/prop-types';
import { IconWarning } from '@udacity/veritas-icons';
import React from 'react';
import { __ } from 'services/localization-service';
import { reportError } from 'initializers/sentry';
import styles from './index.scss';

const PARTNERS = {
  MICROSOFT: 'microsoft',
  NUTANIX: 'nutanix',
  IFRAME: 'iframe',
};

const IFRAME_ELEMENT_ID = 'partner-workspace-frame';

const LAUNCH_STATUSES = {
  NOT_REQUESTED: 'not_requested',
  REQUESTED: 'requested',
  AVAILABLE: 'available',
  ERROR: 'error',
};

@cssModule(styles)
export default class PartnerWorkspace extends React.Component {
  static displayName = 'atoms/workspace-atom/partner-workspace';

  static propTypes = {
    atom: ClassroomPropTypes.workspaceAtom.isRequired,
  };

  state = {
    launchStatus: LAUNCH_STATUSES.NOT_REQUESTED,
    workspaceUrl: '',
    error: '',
  };

  async componentDidMount() {
    const { atom } = this.props;
    const { partner } = atom.configuration;

    if (partner === PARTNERS.IFRAME) {
      this.getIFrameWorkspaceUrl();
    } else {
      this.setState({
        launchStatus: LAUNCH_STATUSES.NOT_REQUESTED,
      });
    }
  }

  getAuthToken = () => {
    return AuthenticationService.getJWTToken();
  };

  getUserId = () => {
    return AuthenticationService.getCurrentUserId();
  };

  /**
   * Refocuses the iframe containing Guacamole if the user is not already
   * focusing another non-body element on the page.
   */
  refocusGuacamole = () => {
    // Ensure iframe is focused
    const iframe = document.getElementById(IFRAME_ELEMENT_ID);
    iframe.focus();
  };

  initMicrosoftWorkspaceUrl = async () => {
    const { atom } = this.props;

    const token = this.getAuthToken();
    if (!token) {
      reportError(
        `Failed to get current user JWT token when  trying to load Microsoft workspace, atom id: ${atom.id}, workspace id: ${atom.workspace_id}`
      );
      this.setState({
        launchStatus: LAUNCH_STATUSES.ERROR,
        error:
          'We encountered an error loading this lab. We are looking into it.',
      });

      return;
    }

    const endpoint =
      CONFIG.nebulixApiUrl +
      `/partners/microsoft/labs/start?workspaceId=${atom.workspace_id}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      this.setState({
        launchStatus: LAUNCH_STATUSES.AVAILABLE,
        workspaceUrl: data.labUrl,
      });
    } else {
      this.setState({
        launchStatus: LAUNCH_STATUSES.ERROR,
        error: data.error,
      });
    }
  };

  getNutanixWorkspaceUrl = () => {
    const { atom } = this.props;
    const { nutanix_pool_id } = atom.configuration;

    this.setState({
      launchStatus: LAUNCH_STATUSES.AVAILABLE,
      workspaceUrl:
        CONFIG.nebulixFEUrl +
        `/frame?workspaceId=${atom.workspace_id}&poolId=${atom.pool_id}&nutanixPoolId=${nutanix_pool_id}`,
    });
  };

  getIFrameWorkspaceUrl = () => {
    const { atom } = this.props;
    const { iframe_url } = atom.configuration;

    this.setState({
      launchStatus: LAUNCH_STATUSES.AVAILABLE,
      workspaceUrl: iframe_url,
    });
  };

  launchWorkspace = async () => {
    this.setState({
      launchStatus: LAUNCH_STATUSES.REQUESTED,
    });

    const { atom } = this.props;
    const { partner } = atom.configuration;

    if (partner === PARTNERS.MICROSOFT) {
      // Attempt to refocus iframe upon click or keydown
      // ref: https://guacamole.apache.org/faq/#iframes
      document.addEventListener('click', this.refocusGuacamole);
      document.addEventListener('keydown', this.refocusGuacamole);
      await this.initMicrosoftWorkspaceUrl();
    } else if (partner === PARTNERS.NUTANIX) {
      this.getNutanixWorkspaceUrl();
    }
  };

  renderError = (error) => {
    return (
      <div styleName="error">
        <IconWarning size="md" title={__('Oops!')} color="red" />
        <p styleName="error-title">
          {__('We are unable to load your Workspace.')}
        </p>
        <p styleName="error-explanation">{error}</p>
      </div>
    );
  };

  renderLaunchButton = () => {
    return (
      <Button
        onClick={this.launchWorkspace}
        variant="primary"
        label="Access Lab"
      />
    );
  };

  renderWorkspace = (workspaceUrl) => {
    return (
      <iframe
        id={IFRAME_ELEMENT_ID}
        src={workspaceUrl}
        title="partnerWorkspace"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    );
  };

  renderLoading = () => {
    return (
      <div styleName="loading-container" role="status" aria-label="Loading">
        <Text styleName="text">Loading your lab&hellip;</Text>
        <div styleName="icon">
          <i className="vds-loading__spinner" />
        </div>
      </div>
    );
  };

  render() {
    const { launchStatus, workspaceUrl, error } = this.state;
    const { atom } = this.props;
    const { partner } = atom.configuration;

    switch (launchStatus) {
      case LAUNCH_STATUSES.NOT_REQUESTED:
        return (
          <div styleName="cta-container">
            {this.renderLaunchButton()}
            {partner === PARTNERS.MICROSOFT && (
              <Text>
                If you are having issues with the lab, please contact support at{' '}
                <a target="_top" href="mailto:udacity-labsupport@udacity.com">
                  udacity-labsupport@udacity.com
                </a>
                .
              </Text>
            )}
          </div>
        );
      case LAUNCH_STATUSES.REQUESTED:
        return <div styleName="ws-container">{this.renderLoading()}</div>;
      case LAUNCH_STATUSES.AVAILABLE:
        return (
          <div styleName="ws-container">
            {this.renderWorkspace(workspaceUrl)}
          </div>
        );
      case LAUNCH_STATUSES.ERROR:
        return <div styleName="ws-container">{this.renderError(error)}</div>;
      default:
        return null;
    }
  }
}
