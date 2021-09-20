import { observer } from 'mobx-react';
import React, { Component } from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { OPEN_EXPLORE_HOME_IDENTIFIER, OPEN_PRIVATE_NETWORK_HOME_IDENTIFIER } from '../../../../apinetwork/navigation/constants';
import { isServedFromPublicWorkspaceDomain, transitionToPublicDesktop } from '../../../../appsdk/utils/commonWorkspaceUtils';
import { OPEN_WORKSPACE_IDENTIFIER } from '../../../../collaboration/navigation/constants';
import { OPEN_INTEGRATIONS_HOME_IDENTIFIER } from '../../../../integrations/navigation/constants';
import { OPEN_BOOTCAMP_IDENTIFIER, OPEN_WORKSPACES_HOME_IDENTIFIER } from '../../../../onboarding/navigation/constants';
import SearchBox from '../../../../search/components/SearchBox';
import XPath from '../../../components/base/XPaths/XPath';
import {
  BUILD_MODE,
  EXPLORE_MODE, HOME_MODE
} from '../../../constants/ModesConstants';
import { HOME } from '../../../navigation/active-mode/constants';
import NavigationService from '../../../services/NavigationService';
import SignedOutHeaderNav from './SignedOutHeaderNav';
import SignedOutHeaderMenu from './SignedOutHeaderMenu';
import { REPORT_GROUPS, REPORT_GROUPS_MAP } from '../../../../report/constants';
import { SIGNED_OUT_HEADER_BREAKPOINT } from './constants';

const StyledHeaderContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  flex: 0 0 48px;
  align-items: center;

  max-width: 100vw;
  height: 48px;
  box-shadow: unset;
  padding: var(--spacing-zero) var(--spacing-s);
  background-color: var(--background-color-primary);
  z-index: 90;
`,
StyledSearchBoxContainer = styled.div`
  .pm-search-box-container {
    position: unset;
    transform: unset;
    flex: 1;
    display: flex;
    justify-content: center;

    // Make sure the expanded search popover renders fine
    &.is_focused {
      display: unset;
      position: absolute;
      transform: translateX(-50%);
    }
  }
  @media screen and (max-width: ${SIGNED_OUT_HEADER_BREAKPOINT}px) {
    display: none;
  }
`;

@observer
export default class SignedOutHeaderContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: 'build',
      defaultUserWorkspaceId: ''
    };

    this.traceId = uuid();
    this.getLinkToHome = this.getLinkToHome.bind(this);
    this.getLinkToReports = this.getLinkToReports.bind(this);
    this.getLinkToExplore = this.getLinkToExplore.bind(this);
    this.handleClickOnExploreDesktop = this.handleClickOnExploreDesktop.bind(this);
    this.handleMouseOverOnExplore = this.handleMouseOverOnExplore.bind(this);
  }

  getLinkToHome () {
    const isServedFromPublicDomain = isServedFromPublicWorkspaceDomain();

    // if the app is served a public workspace domain
    // home view should take the user to private context
    if (isServedFromPublicDomain) {

      return `${pm.dashboardUrl}/home`;
    }

    // otherwise this is an internal navigation
    return { routeIdentifier: HOME };
  }

  getLinkToReports () {
    if (window.SDK_PLATFORM === 'browser') {
      return pm.dashboardUrl + '/' + REPORT_GROUPS_MAP[REPORT_GROUPS.summary].path;
    }

    return '';
  }

  getLinkToExplore () {
    return window.SDK_PLATFORM === 'browser' ? window.postman_explore_redirect_url : '';
  }

  handleClickOnExploreDesktop (e) {
    if (window.SDK_PLATFORM === 'browser') {
      return;
    }

    // Prevent the default behavior of the Link component on desktop
    e.preventDefault();

    // If we are in the public context, just trigger internal redirection
    if (isServedFromPublicWorkspaceDomain()) {
      NavigationService.transitionTo(OPEN_EXPLORE_HOME_IDENTIFIER);
    }

    // Else switch context and then transition
    else {
      transitionToPublicDesktop(OPEN_EXPLORE_HOME_IDENTIFIER);
    }

  }

  handleMouseOverOnExplore () {
    if (!pm.isScratchpad || window.SDK_PLATFORM === 'browser') {
      return;
    }

    // We are triggering a websocket connection on hover because we need to capture the intent
    // of the user as early as possible.
    // When the user hovers over `Explore`, it means they show an intent to visit the public
    // API Network. So, we need an active websocket connection for it.
    pm.syncManager.triggerWebSocketConnection();
  }

  render () {
    return (
      <XPath identifier='header'>
        <StyledHeaderContainer>
          <SignedOutHeaderNav traceId={this.traceId} />
          <StyledSearchBoxContainer>
            <SearchBox isHiddenOnMobile traceId={this.traceId} />
          </StyledSearchBoxContainer>
          <SignedOutHeaderMenu traceId={this.traceId} />
        </StyledHeaderContainer>
      </XPath>
    );
  }
}
