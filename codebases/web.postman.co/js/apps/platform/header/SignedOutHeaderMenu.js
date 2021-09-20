import React, { Component, Fragment } from 'react';
import { Button as AetherButton, Text, IconDirectionDown, IconDirectionUp, Flex, Heading, IconDirectionForward } from '@postman/aether';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Link from '../../../../appsdk/components/link/Link';
import { SCRATCHPAD } from '../../../../appsdk/navigation/constants';
import { PageService } from '../../../../appsdk/services/PageService';
import AnalyticsService from '../../../modules/services/AnalyticsService';
import { OPEN_WORKSPACE_IDENTIFIER } from '../../../../collaboration/navigation/constants';
import { SIGNED_OUT_HOMEPAGE_TOP_DROPDOWN_OPTIONS, SIGNED_OUT_HOMEPAGE_TOP_ENTERPRISE_DROPDOWN_OPTIONS, SIGNED_OUT_HOMEPAGE_TOP_SUPPORT_DROPDOWN_OPTIONS,
  SIGNED_OUT_HOMEPAGE_TOP_LEARNING_DROPDOWN_OPTIONS, SIGNED_OUT_HOMEPAGE_TOP_COMMUNITY_DROPDOWN_OPTIONS } from '../../../../onboarding/src/features/Homepage/pages/HomepageSignedOut/HomepageSignedOutConstants';
import { PRICING_LINK, POSTMAN_ENTERPRISE } from '../../../constants/AppUrlConstants';
import { HOME, SEARCH } from '../../../navigation/active-mode/constants';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import SignedOutHeaderCTA from './SignedOutHeaderCTA';
import SearchBox from '../../../../search/components/SearchBox';
import NavigationService from '../../../services/NavigationService';
import { SIGNED_OUT_HEADER_BREAKPOINT } from './constants';

const LINKS = {
    HOME: { routeIdentifier: HOME },
    PRICING: PRICING_LINK,
    ENTERPRISE: POSTMAN_ENTERPRISE,
    LEARNING_CENTER: 'https://go.pstmn.io/docs'
  },
  StyledHeading = styled(Heading)``,
  StyledLink = styled.div`
    font-size: var(--text-size-l);
    line-height: var(--line-height-m);
    font-weight: var(--text-weight-medium);
    color: var(--content-color-secondary);
    &:hover ${StyledHeading} {
      color: var(--content-color-primary);
    }
    &:hover {
      cursor: pointer
    }
    padding: var(--spacing-zero);
  `,
  StyledIconContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 64px;
    margin-right: var(--spacing-s);
  `,
  StyledPopoverMenu = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: var(--background-color-primary);
    position: absolute;
    left: 0;
    z-index: 1000;
    overflow-y: auto;
    box-sizing: border-box;
    top: 48px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    padding: var(--spacing-l);
    transform-origin: 0 0;
    transition: opacity 0.4s, transform 0.4s;
    transform: ${(props) => (props.isOpen ? 'scaleY(1)' : 'scaleY(0)')};
    opacity: ${(props) => (props.isOpen ? '1' : '0')};
  `,
  StyledNavItems = styled.ul`
    padding: var(--spacing-m) var(--spacing-zero) var(--spacing-zero) var(--spacing-m);
    margin: 0;
    list-style: none;
    display: block;
    flex-direction: column;
    flex-wrap: wrap;
    a:hover {
      color: var(--content-color-link);
    }
  `,
  StyledNav = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    button,
    a {
      font-size: var(--text-size-l);
      line-height: var(--line-height-m);
      font-weight: var(--text-weight-medium);
      color: var(--content-color-secondary);
      &:hover {
        color: var(--content-color-primary);
        cursor: pointer;
      }
      padding: var(--spacing-zero);
    }
    button {
      /* Needed because button component does not support icon placement */
      flex-direction: row-reverse;
      padding: var(--spacing-xs);
    }
    & > * + * {
      margin-left: var(--spacing-s);
    }
  `,
  StyledHeaderRight = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    @media screen and (max-width: ${SIGNED_OUT_HEADER_BREAKPOINT}px) {
      display: none;
    }
  `,
  StyledHeaderRightResponsive = styled.div`
    display: none;

    @media screen and (max-width: ${SIGNED_OUT_HEADER_BREAKPOINT}px) {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  `,
  StyledNavTable = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%
  `,
  StyledNavLink = styled.li`
    padding: 6px 16px;
  `,
  StyledDropdownMenuItem = styled.li`
    padding: 8px 16px;

    &:hover {
      background-color: var(--highlight-background-color-primary);
    }
  `,
  StyledDropdownHeading = styled(Heading)`
    padding-left: var(--spacing-m);
    padding-bottom: var(--spacing-s);
  `,
  StyledDropdownLink = styled(Text)`
    display: inline-flex;
    align-items: center
  `;

@observer
class SignedOutHeaderMenu extends Component {
  constructor (props) {
    super(props);

    this.handleInviteButton = this.handleInviteButton.bind(this);
    this.state = {
      isMenuOpen: false,
      currentActiveDropdown: null
    };
  }

  toggleDropdown = (menuName) => {
    this.setState((prevState) => {
      return { currentActiveDropdown: prevState.currentActiveDropdown === menuName ? null : menuName };
    });
  }

  async handleInviteButton (source) {
    return pm.mediator.trigger('showSignInModal', {
      type: 'generic',
      subtitle: 'You need an account to continue exploring Postman.',
      origin: 'requester_header_invite_action'
    });
  }

  showSyncButton () {
    // show the icon if it's browser and current page is workspace page
    if (window.SDK_PLATFORM === 'browser') {
      return PageService.activePageName === OPEN_WORKSPACE_IDENTIFIER;
    }

    if (window.SDK_PLATFORM === 'desktop') {
      return PageService.activePageName === OPEN_WORKSPACE_IDENTIFIER || PageService.activePageName === SCRATCHPAD;
    }

    return true;
  }

  toggleMenu (menuName, state) {
    this.setState({
      [menuName]: state
    });
  }

  getLinkToExplore () {
    return window.SDK_PLATFORM === 'browser' ? window.postman_explore_redirect_url : '';
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
    let { isMenuOpen, currentActiveDropdown } = this.state;

    return (
      <Fragment>
        <StyledHeaderRight>
          <SignedOutHeaderCTA />
        </StyledHeaderRight>
        <StyledHeaderRightResponsive>
          <StyledIconContainer>
            <SearchBox />
            <AetherButton
              onClick={(e) => {
                this.toggleMenu('isMenuOpen', !isMenuOpen);
                this.captureMenuSelection(e, 'product');
              }}
              type='tertiary'
              icon={isMenuOpen ? 'icon-action-close-stroke' : 'icon-descriptive-menu-stroke'}
            />
          </StyledIconContainer>
          <StyledPopoverMenu isOpen={isMenuOpen}>
            <StyledNav>
              <StyledNavTable>
                <StyledNavLink>
                  <StyledLink onClick={() => this.toggleDropdown('product')}>
                    <Flex justifyContent='space-between'>
                      <StyledHeading type='h4' text='Product' color={currentActiveDropdown === 'product' ? 'content-color-primary' : 'content-color-secondary'} />
                      {currentActiveDropdown === 'product' ? <IconDirectionUp /> : <IconDirectionDown />}
                    </Flex>
                  </StyledLink>
                  {currentActiveDropdown === 'product' && (
                    <StyledNavItems>
                      {_.map(SIGNED_OUT_HOMEPAGE_TOP_DROPDOWN_OPTIONS, (option, index) => {
                        return (
                          <StyledDropdownMenuItem key={index}>
                            <Link to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, option.text)}>
                              {option.type === 'text' ? <Text type='body-large' color='content-color-primary'>{option.text}</Text> :
                                <StyledDropdownLink type='body-large' color='content-color-link'>{option.text}&nbsp;<IconDirectionForward color='content-color-link' /></StyledDropdownLink>}
                            </Link>
                          </StyledDropdownMenuItem>
                        );
                      })}
                    </StyledNavItems>
                  )}
                </StyledNavLink>

                <StyledNavLink>
                  <Link to={LINKS.PRICING} onClick={(e) => this.captureMenuSelection(e, 'pricing')}>
                    <StyledHeading type='h4' text='Pricing' color='content-color-secondary' />
                  </Link>
                </StyledNavLink>

                <StyledNavLink>
                  <StyledLink onClick={() => this.toggleDropdown('enterprise')}>
                    <Flex justifyContent='space-between'>
                      <StyledHeading type='h4' text='Enterprise' color={currentActiveDropdown === 'enterprise' ? 'content-color-primary' : 'content-color-secondary'} />
                      {currentActiveDropdown === 'enterprise' ? <IconDirectionUp /> : <IconDirectionDown />}
                    </Flex>
                  </StyledLink>
                  {currentActiveDropdown === 'enterprise' && (
                    <StyledNavItems>
                      {_.map(SIGNED_OUT_HOMEPAGE_TOP_ENTERPRISE_DROPDOWN_OPTIONS, (option, index) => {
                        return (
                          <StyledDropdownMenuItem key={index}>
                            <Link to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, option.text)}>
                              <div><Text type='body-large' color='content-color-primary'>{option.text}</Text></div>
                            </Link>
                          </StyledDropdownMenuItem>
                        );
                      })}
                    </StyledNavItems>
                  )}
                </StyledNavLink>

                <StyledNavLink>
                  <StyledLink onClick={() => this.toggleDropdown('resources')}>
                    <Flex justifyContent='space-between'>
                      <StyledHeading type='h4' text='Resources and support' color={currentActiveDropdown === 'resources' ? 'content-color-primary' : 'content-color-secondary'} />
                      {currentActiveDropdown === 'resources' ? <IconDirectionUp /> : <IconDirectionDown />}
                    </Flex>
                  </StyledLink>
                  {currentActiveDropdown === 'resources' && (
                    <StyledNavItems>
                      <Flex justifyContent='space-between' wrap='wrap'>
                        <Flex direction='column'>
                          <StyledDropdownHeading type='h3' text='Learning' color='content-color-secondary' />
                          {_.map(SIGNED_OUT_HOMEPAGE_TOP_LEARNING_DROPDOWN_OPTIONS, (option, index) => {
                            return (
                              <StyledDropdownMenuItem key={index}>
                                <Link to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, option.text)}>
                                  <div><Text type='body-large' color='content-color-primary'>{option.text}</Text></div>
                                </Link>
                              </StyledDropdownMenuItem>
                            );
                          })}
                        </Flex>
                        <Flex direction='column'>
                          <StyledDropdownHeading type='h3' text='Community and events' color='content-color-secondary' />
                          {_.map(SIGNED_OUT_HOMEPAGE_TOP_COMMUNITY_DROPDOWN_OPTIONS, (option, index) => {
                            return (
                              <StyledDropdownMenuItem key={index}>
                                <Link to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, option.text)}>
                                  <div><Text type='body-large' color='content-color-primary'>{option.text}</Text></div>
                                </Link>
                              </StyledDropdownMenuItem>
                            );
                          })}
                        </Flex>
                        <Flex direction='column'>
                          <StyledDropdownHeading type='h3' text='Support' color='content-color-secondary' />
                          {_.map(SIGNED_OUT_HOMEPAGE_TOP_SUPPORT_DROPDOWN_OPTIONS, (option, index) => {
                            return (
                              <StyledDropdownMenuItem key={index}>
                                <Link to={this.getUrl(option.link)} onClick={(e) => this.captureMenuSelection(e, option.text)}>
                                  <div><Text type='body-large' color='content-color-primary'>{option.text}</Text></div>
                                </Link>
                              </StyledDropdownMenuItem>
                            );
                          })}
                        </Flex>
                      </Flex>
                    </StyledNavItems>
                  )}
                </StyledNavLink>

                <StyledNavLink>
                  <Link
                    to={this.getLinkToExplore()}
                    onClick={(e) => {
                      this.captureMenuSelection(e, 'explore-header');
                      this.handleClickOnExploreDesktop();
                    }}
                  >
                    <StyledHeading type='h4' text='Explore' color='content-color-secondary' />
                  </Link>
                </StyledNavLink>
              </StyledNavTable>
            </StyledNav>
            <SignedOutHeaderCTA />
          </StyledPopoverMenu>
        </StyledHeaderRightResponsive>
      </Fragment>
    );

  }
}

// withLDConsumer returns a React component injected with flags & ldClient as props
export default withLDConsumer()(SignedOutHeaderMenu);
