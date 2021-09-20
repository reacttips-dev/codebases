import React, { Component } from 'react';
import { Modal, ModalContent, ModalFooter, Button, Flex, Heading, Text } from '@postman/aether';
import TeamFeatureOverview from './Illustration/TeamFeatureOverview';
import { TEAM_OVERVIEW_CONSTANTS } from './TeamOverviewConstants';
import Link from '../../../../appsdk/components/link/Link';
import FeatureOverviewPagination from './FeatureOverviewPagination';
import { OPEN_WORKSPACES_HOME_IDENTIFIER } from '../../../navigation/constants';
import { OPEN_WORKSPACE_IDENTIFIER } from '../../../../collaboration/navigation/constants';
import NavigationService from '../../../../js/services/NavigationService';
import styled from 'styled-components';
import { launchDarkly } from '../../common/LaunchDarkly';
import AnalyticsService from '../../../../js/modules/services/AnalyticsService';

const LEARNING_CENTER_URL = 'https://learning.postman.com/docs/collaborating-in-postman/collaboration-intro/';

const OverviewContainer = styled.div`
  .illustration {
    background-color: var(--background-color-secondary);
    display: flex;
    align-items: center;
    padding-top: var(--spacing-xxxl);
    padding-bottom: var(--spacing-xxl);
    position: relative;
    justify-content: center;
    box-shadow: 0px -24px 0px 24px var(--background-color-secondary);

    svg {
      width: 100%;
    }
  }

  .cross-icon {
    position: absolute;
    top: var(--spacing-s);
    right: var(--spacing-zero);
  }
`;

const OverviewIllustration = styled.div`
  svg {
    height: 349px;
  }
`;

const OverviewContent = styled.div`
  .gif-heading {
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-zero);
  }

  .link {
    font-size: var(--text-size-m);
    margin-bottom: 30px;
  }

  .gif-text {
    margin: var(--spacing-s) var(--spacing-zero) var(--spacing-xxl) var(--spacing-zero);
    line-height: 22px;
    display: block;
  }

  .gif-text-link {
    margin: var(--spacing-s) var(--spacing-zero) var(--spacing-xs) var(--spacing-zero);
    line-height: 22px;
    display: block;
  }
`;

const OverviewPrimaryButton = styled.div`
  .margin {
    margin-right: 166px;
  }

  .button {
    span {
      padding: var(--spacing-s) var(--spacing-m);
    }
  }

  .footer {
    display: flex;
    align-items: baseline;
  }
`;

const OverviewSecondaryButton = styled.div`
  .button {
    span {
      padding: var(--spacing-s) var(--spacing-m);
    }
  }
`;

export default class GifOverview extends Component {
  constructor (props) {
    super(props);

    this.state = {
      overviewState: TEAM_OVERVIEW_CONSTANTS.state.HOME
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }

  componentDidMount () {
    launchDarkly.track('team_feature_overview_modal_shown');
  }

  /**
   * @method handleNext
   * @description Handles the next in every modal of gifs
   */
  handleNext () {
    const overviewState = this.state.overviewState,
      currentURL = NavigationService.getCurrentURL(),
      routesForCurrentUrl = NavigationService.getRoutesForURL(currentURL);

    switch (overviewState) {
      case TEAM_OVERVIEW_CONSTANTS.state.HOME:
        launchDarkly.track('team_feature_overview_initiated');

        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.COLLABORATE });
        break;

      case TEAM_OVERVIEW_CONSTANTS.state.COLLABORATE:
        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.COMMENT });
        break;

      case TEAM_OVERVIEW_CONSTANTS.state.COMMENT:
        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.TRACK });
        break;

      case TEAM_OVERVIEW_CONSTANTS.state.TRACK:
        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.API });
        break;

      case TEAM_OVERVIEW_CONSTANTS.state.API:
        if (!_.size(routesForCurrentUrl) || !routesForCurrentUrl.find((match) => match.name === OPEN_WORKSPACE_IDENTIFIER)) {
          NavigationService.transitionTo(OPEN_WORKSPACES_HOME_IDENTIFIER);
          launchDarkly.trackAndFlush('team_feature_overview_completed');
        }
        else {
          launchDarkly.track('team_feature_overview_completed');
        }

        AnalyticsService.addEventV2AndPublish({
          category: 'team_feature_overview',
          action: 'click',
          label: 'gif_goto_workspace'
        });

        this.props.handleToggle({ isOpen: false });

        break;
    }
  }

  /**
   * @method handlePrevious
   * @description Handles the previous in every modal of gifs
   */
  handlePrevious () {
    const overviewState = this.state.overviewState;

    switch (overviewState) {
      case TEAM_OVERVIEW_CONSTANTS.state.COLLABORATE:
        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.HOME });
        break;

      case TEAM_OVERVIEW_CONSTANTS.state.COMMENT:
        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.COLLABORATE });
        break;

      case TEAM_OVERVIEW_CONSTANTS.state.TRACK:
        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.COMMENT });
        break;

      case TEAM_OVERVIEW_CONSTANTS.state.API:
        this.setState({ overviewState: TEAM_OVERVIEW_CONSTANTS.state.TRACK });
        break;
    }
  }

  render () {
    let state = this.state.overviewState,
      src = TEAM_OVERVIEW_CONSTANTS.gif[state],
      currentURL = NavigationService.getCurrentURL(),
      routesForCurrentUrl = NavigationService.getRoutesForURL(currentURL),
      primaryActionText = TEAM_OVERVIEW_CONSTANTS.button[state],
      poster = TEAM_OVERVIEW_CONSTANTS.image[state];

    if (state === TEAM_OVERVIEW_CONSTANTS.state.API && routesForCurrentUrl.find((match) => match.name === OPEN_WORKSPACE_IDENTIFIER)) {
      primaryActionText = 'Got it';
    }

    return (
      <Modal
        isOpen
        size='medium'
        onClose={() => {
          this.props.handleToggle({ isOpen: false, modalClosed: true });
        }}
      >
        <ModalContent>
          <OverviewContainer>
            <div className='illustration'>
              <Button
                onClick={() => { this.props.handleToggle({ isOpen: false, modalClosed: true }); }}
                type='tertiary'
                className='cross-icon'
                icon='icon-action-close-stroke'
              />
              {
                state === TEAM_OVERVIEW_CONSTANTS.state.HOME ?
                  <OverviewIllustration>
                    <TeamFeatureOverview />
                  </OverviewIllustration> :
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    width='600'
                    height='353'
                    key={src}
                    poster={poster}
                  >
                    <source src={src} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
              }
            </div>
            <OverviewContent>
              <Heading
                type='h2'
                className='gif-heading'
                text={TEAM_OVERVIEW_CONSTANTS[state].header}
              />
              <Text className={state === TEAM_OVERVIEW_CONSTANTS.state.API ? 'gif-text-link' : 'gif-text'} type='body-large'>
                {TEAM_OVERVIEW_CONSTANTS[state].description}
              </Text>
              {
                state === TEAM_OVERVIEW_CONSTANTS.state.API &&
                <Link to={LEARNING_CENTER_URL} target='_blank'>
                  <Text
                    type='link-primary'
                    isExternal
                    className='link'
                  >
                    Learn more about collaborating on Postman
                  </Text>
                </Link>
              }
            </OverviewContent>
          </OverviewContainer>
        </ModalContent>
        <ModalFooter>
          <Flex
            grow={1}
            shrink={1}
            justifyContent={state === TEAM_OVERVIEW_CONSTANTS.state.HOME ? 'flex-end' : 'space-between'}
            gap='spacing-s'
            alignItems='center'
          >
          {
            state !== TEAM_OVERVIEW_CONSTANTS.state.HOME &&
            <OverviewPrimaryButton>
              <div className='footer'>
                <Button
                  type='secondary'
                  size='medium'
                  text='Previous'
                  className='button margin'
                  onClick={this.handlePrevious}
                />
                <FeatureOverviewPagination overviewState={state} />
              </div>
              </OverviewPrimaryButton>
          }
          <OverviewSecondaryButton>
            <Button
              type='primary'
              size='medium'
              text={primaryActionText}
              className='button'
              onClick={this.handleNext}
            />
          </OverviewSecondaryButton>
          </Flex>
        </ModalFooter>
      </Modal>
    );
  }
}
