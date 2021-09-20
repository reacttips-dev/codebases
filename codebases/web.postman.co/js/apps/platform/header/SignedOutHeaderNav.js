import { observer } from 'mobx-react';
import React, { Component } from 'react';
import styled from 'styled-components';
import { OPEN_EXPLORE_HOME_IDENTIFIER } from '../../../../apinetwork/navigation/constants';
import Link from '../../../../appsdk/components/link/Link';
import {
  isServedFromPublicWorkspaceDomain,
  transitionToPublicDesktop,
  transitionToPrivateDesktop
} from '../../../../appsdk/utils/commonWorkspaceUtils';
import PostmanLogo from '../../../../onboarding/src/features/Homepage/widgets/Announcements/PostmanLogo';
import { HOME } from '../../../navigation/active-mode/constants';
import { PRICING_LINK, POSTMAN_ENTERPRISE } from '../../../constants/AppUrlConstants';
import NavigationService from '../../../services/NavigationService';
import AnalyticsService from '../../../modules/services/AnalyticsService';
import { SIGNED_OUT_HOMEPAGE_TOP_DROPDOWN_OPTIONS, SIGNED_OUT_HOMEPAGE_TOP_ENTERPRISE_DROPDOWN_OPTIONS, SIGNED_OUT_HOMEPAGE_TOP_LEARNING_DROPDOWN_OPTIONS,
  SIGNED_OUT_HOMEPAGE_TOP_COMMUNITY_DROPDOWN_OPTIONS, SIGNED_OUT_HOMEPAGE_TOP_SUPPORT_DROPDOWN_OPTIONS } from '../../../../onboarding/src/features/Homepage/pages/HomepageSignedOut/HomepageSignedOutConstants';
import { REPORT_GROUPS, REPORT_GROUPS_MAP } from '../../../../report/constants';
import { Icon, Popover, MenuItem, Flex, Heading, IconDirectionForward, Text } from '@postman/aether';
import { SIGNED_OUT_HEADER_BREAKPOINT } from './constants';

const StyledMenuItemLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;

  .header-link-text {
    display: inline-flex;
    align-items: center;
  }
`;

const StyledPopoverContent = styled.div`
  box-sizing: border-box;
  padding: var(--spacing-l);
  min-width: 170px;
`;


const LINKS = {
  HOME: { routeIdentifier: HOME },
  PRICING: PRICING_LINK,
  ENTERPRISE: POSTMAN_ENTERPRISE,
  LEARNING_CENTER: 'https://go.pstmn.io/docs'
},
  StyledHeaderLeftSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  StyledNavigationButtons = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    margin-right: var(--spacing-s);

    @media screen and (max-width: ${SIGNED_OUT_HEADER_BREAKPOINT}px) {
      display: none;
    }
  `,
  StyledNavigationButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    user-select: none;
    cursor: pointer;
    padding: var(--spacing-zero) var(--spacing-m);
    font-size: var(--text-size-l);
    line-height: var(--line-height-m);
    font-weight: var(--text-weight-medium);
    color: var(--content-color-secondary);

    i {
      margin-left: unset;
    }

    &:hover {
      color: var(--content-color-primary);
    }
  `,
  StyledResourcesPopoverContent = styled.div`
    box-sizing: border-box;
    padding: var(--spacing-l);
  `,
  StyledPopover = styled(Popover)`
    // to override aether defined max width
    max-width: unset !important;
  `,
  StyledHeading = styled(Heading)`
    padding: var(--spacing-s) var(--spacing-m);
  `;

@observer
export default class SignedOutHeaderNav extends Component {
  constructor (props) {
    super(props);

    this.handleClickOnExploreDesktop = this.handleClickOnExploreDesktop.bind(this);
    this.handleMouseOverOnExplore = this.handleMouseOverOnExplore.bind(this);
  }

  getLinkToHome () {
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

  getApiButtonDisabledText (isLoggedIn, isOnline) {
    if (!isLoggedIn) return 'Sign in to create an API';
    if (!isOnline) return 'Get online to create an API';

    return '';
  }

  // analytics events
  captureMenuSelection (e, label) {
    const { traceId } = this.props;
    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label,
      traceId,
      value: 1
    });
  }

  getUrl = (link) => {
    return _.startsWith(link, 'https') ? link : (pm.webUrl + link);
  }

  render () {

    return (
      <StyledHeaderLeftSection>
        <Link
          to={LINKS.HOME}
          onClick={(e) => {

            if (window.SDK_PLATFORM === 'browser') {
              return;
            }

            e.stopPropagation();
            e.preventDefault();

            if (window.SDK_PLATFORM === 'desktop' && !pm.isScratchpad) {
              transitionToPrivateDesktop('home');
            } else {
              NavigationService.transitionToURL('home');
            }
          }}
        >
          <PostmanLogo width='32' height='32' />
        </Link>
        <StyledNavigationButtons>
          <PopoverWrapper title='Product' onClick={(e) => this.captureMenuSelection(e, 'product')}>
            <StyledPopoverContent>
              {_.map(SIGNED_OUT_HOMEPAGE_TOP_DROPDOWN_OPTIONS, (option, index) => {
                  return (
                    <MenuItem key={index}>
                      <StyledMenuItemLink to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, `product-${option.text}`)}>
                        {option.type === 'text' ?
                          <span>{option.text}</span> :
                          <Text color='content-color-link' className='header-link-text'>{option.text} <IconDirectionForward color='content-color-link' /></Text>
                        }
                      </StyledMenuItemLink>
                    </MenuItem>
                  );
                })}
            </StyledPopoverContent>
          </PopoverWrapper>

          <Link to={LINKS.PRICING} onClick={(e) => this.captureMenuSelection(e, 'pricing')}>
            <StyledNavigationButton>Pricing</StyledNavigationButton>
          </Link>

          <PopoverWrapper title='Enterprise' onClick={(e) => this.captureMenuSelection(e, 'enterprise')} >
            <StyledPopoverContent>
              {_.map(SIGNED_OUT_HOMEPAGE_TOP_ENTERPRISE_DROPDOWN_OPTIONS, (option, index) => {
                  return (
                    <MenuItem key={index}>
                      <StyledMenuItemLink to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, 'enterprise')}>
                        <div>{option.text}</div>
                      </StyledMenuItemLink>
                    </MenuItem>
                  );
                })}
            </StyledPopoverContent>
          </PopoverWrapper>

          <PopoverWrapper title='Resources and Support' onClick={(e) => this.captureMenuSelection(e, 'resource')}>
            <StyledResourcesPopoverContent>
              <Flex gap='spacing-xl'>
                <Flex direction='column'>
                  <StyledHeading type='h3' text='Learning' color='content-color-secondary' />
                  {_.map(SIGNED_OUT_HOMEPAGE_TOP_LEARNING_DROPDOWN_OPTIONS, (option, index) => {
                    return (
                      <MenuItem key={index}>
                        <StyledMenuItemLink to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, 'learning')}>
                          <div>{option.text}</div>
                        </StyledMenuItemLink>
                      </MenuItem>
                    );
                  })}
                </Flex>
                <Flex direction='column'>
                  <StyledHeading type='h3' text='Community and events' color='content-color-secondary' />
                  {_.map(SIGNED_OUT_HOMEPAGE_TOP_COMMUNITY_DROPDOWN_OPTIONS, (option, index) => {
                    return (
                      <MenuItem key={index}>
                        <StyledMenuItemLink to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, 'learning')}>
                          <div>{option.text}</div>
                        </StyledMenuItemLink>
                      </MenuItem>
                    );
                  })}
                </Flex>
                <Flex direction='column'>
                  <StyledHeading type='h3' text='Support' color='content-color-secondary' />
                  {_.map(SIGNED_OUT_HOMEPAGE_TOP_SUPPORT_DROPDOWN_OPTIONS, (option, index) => {
                    return (
                      <MenuItem key={index}>
                        <StyledMenuItemLink to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, 'learning')}>
                          <div>{option.text}</div>
                        </StyledMenuItemLink>
                      </MenuItem>
                    );
                  })}
                </Flex>
              </Flex>
            </StyledResourcesPopoverContent>
          </PopoverWrapper>

          <Link
            to={this.getLinkToExplore()}
            onClick={(e) => {
              this.captureMenuSelection(e, 'explore-header');
              this.handleClickOnExploreDesktop();
            }}
          >
            <StyledNavigationButton onMouseOver={this.handleMouseOverOnExplore}>
              Explore
            </StyledNavigationButton>
          </Link>
        </StyledNavigationButtons>
      </StyledHeaderLeftSection>
    );
  }
}

class PopoverWrapper extends Component {
  constructor (props) {
    super(props);

    this.togglePopover = this.togglePopover.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {
      isOpen: false
    };
  }

  handleClickOutside () {
    this.setState({
      isOpen: false
    });
  }

  togglePopover (e) {
    this.props.onClick(e);
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    const popoverTrigger = (
      <StyledNavigationButton onClick={this.togglePopover}>
        {this.props.title}
        <Icon name={this.state.isOpen ? 'icon-direction-up' : 'icon-direction-down'} />
      </StyledNavigationButton>
    );

    return (
      <StyledPopover
        trigger={popoverTrigger}
        placement='bottom-start'
        padding='spacing-zero'
        isOpen={this.state.isOpen}
        onClickOutside={this.handleClickOutside}
        className={this.props.className ? this.props.className : ''}
      >
        {this.props.children}
      </StyledPopover>
    );
  }
}
